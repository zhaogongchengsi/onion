import { describe, expect, it } from 'vitest'
import { Onion } from '.'

describe('Onion', () => {
	it('use', () => {
		const onion = new Onion()
		const fn = async (ctx: any, next: () => Promise<void>) => {
			await next()
			ctx.count++
		}
		onion.use(fn)
		expect(onion.middlewares.length).toBe(1)

	})

	it('use error', () => {
		const onion = new Onion()
		const fn = {} as any
		expect(() => onion.use(fn)).toThrowError()
	})

	it('run', async () => {
		const onion = new Onion()
		const ctx = { count: 0 }

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
			await next()
			ctx.count++
		})
		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
			await next()
			ctx.count++
		})
		await onion.run(ctx)
		expect(ctx.count).toBe(4)
	})

	it('run without next', async () => {
		const onion = new Onion()
		const ctx = { count: 0 }

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
		})

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
		})

		await onion.run(ctx)
		expect(ctx.count).toBe(2)
	})

	it('run auto next', async () => {
		const onion = new Onion()
		const ctx = { count: 0 }

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
			await next()
			ctx.count++
		})

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
		})

		await onion.run(ctx)
		expect(ctx.count).toBe(3)
	})

	it('run auto next error', async () => {
		const onion = new Onion()
		const ctx = { count: 0 }

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
			await next()
			ctx.count++
		})

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
			throw new Error('error')
		})

		try {
			await onion.run(ctx)
		} catch (err) {
			expect(ctx.count).toBe(2)
		}
	})

	// 测试非自动执行的情况
	it('run without auto', async () => {
		const onion = new Onion(false)
		const ctx = { count: 0 }

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
		})

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			ctx.count++
		})

		await onion.run(ctx)

		expect(ctx.count).toBe(1)
	})

	// 测试执行顺序
	it('run order', async () => {
		const onion = new Onion()
		
		const order: number[] = []

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			order.push(1)
			await next()
			order.push(5)
		})

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			order.push(2)
			await next()
			order.push(4)
		})

		onion.use(async (ctx: any, next: () => Promise<void>) => {
			order.push(3)
		})

		await onion.run()

		expect(order).toEqual([1, 2, 3, 4, 5])
	})

})