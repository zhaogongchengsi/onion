
export type OnionMiddlewareFn<T> = (ctx: any, next: () => Promise<void>) => Promise<void>

export type OnionCustomNextFn<T> = (ctx: any, i: number) => Promise<void>


export class Onion<T extends any> {
	// 1. 首先定义一个中间件数组
	middlewares: OnionMiddlewareFn<T>[]
	auto: boolean
	before?: OnionCustomNextFn<T>
	after?: OnionCustomNextFn<T>

	constructor(auto: boolean = true, before?: OnionCustomNextFn<T>, after?: OnionCustomNextFn<T>) {
		this.auto = auto
		this.middlewares = []
		this.before = before
		this.after = after
	}
	// 2. 定义一个use方法，用来注册中间件
	use(fn: OnionMiddlewareFn<T>) {
		if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
		this.middlewares.push(fn)
	}

	compose(middlewares: OnionMiddlewareFn<T>[]) {
		let index = -1
		let auto = this.auto
		let before = this.before
		let after = this.after
		return (context: T | undefined) => {
			return async function dispatch(i: number): Promise<void> {
				if (i <= index) return Promise.reject(new Error('next() called multiple times'))
				index = i
				let fn = middlewares[i]
				if (!fn) return Promise.resolve()
				try {

					let current = i
					if (before) {
						await before(context, i)
					}
					await Promise.resolve(fn(context, dispatch.bind(null, index + 1)))
					if (auto && i === current) {
						await dispatch(index + 1)
					}
					if (after) {
						await after(context, i)
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