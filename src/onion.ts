
export type OnionMiddlewareFn = (ctx: any, next: () => Promise<void>) => Promise<void>

export class Onion<T extends any> {
	// 1. 首先定义一个中间件数组
	middlewares: OnionMiddlewareFn[]
	auto: boolean

	constructor(auto: boolean = true) {
		this.auto = auto
		this.middlewares = []
	}
	// 2. 定义一个use方法，用来注册中间件
	use(fn: OnionMiddlewareFn) {
		if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
		this.middlewares.push(fn)
	}

	compose(middlewares: OnionMiddlewareFn[]) {
		let index = -1
		let auto = this.auto
		return (context: T | undefined) => {
			return async function dispatch(i: number): Promise<void> {
				if (i <= index) return Promise.reject(new Error('next() called multiple times'))
				index = i
				let fn = middlewares[i]
				if (!fn) return Promise.resolve()
				try {
					let current = i
					await Promise.resolve(fn(context, dispatch.bind(null, index + 1)))
					if (auto && i === current) {
						dispatch(index + 1)
					}
				} catch (err) {
					return Promise.reject(err)
				}
			}
		}

	}

	// 4. 定义一个run方法，用来执行中间件
	async run(ctx?: T) {
		return this.compose(this.middlewares)(ctx)(0)
	}
}