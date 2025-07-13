// = https://dev.to/nexxeln/implementing-the-pipe-operator-in-typescript-30ip
type Func<T, R> = (arg: T) => R;

function pipe<A, B>(f1: Func<A, B>): Func<A, B>;
function pipe<A, B, C>(f1: Func<A, B>, f2: Func<B, C>): Func<A, C>;
function pipe<A, B, C, D>(f1: Func<A, B>, f2: Func<B, C>, f3: Func<C, D>): Func<A, D>;
function pipe<A, B, C, D, E>(f1: Func<A, B>, f2: Func<B, C>, f3: Func<C, D>, f4: Func<D, E>): Func<A, E>;
function pipe<A, B, C, D, E, F>(f1: Func<A, B>, f2: Func<B, C>, f3: Func<C, D>, f4: Func<D, E>, f5: Func<E, F>): Func<A, F>;
function pipe<A, B, C, D, E, F, G>(f1: Func<A, B>, f2: Func<B, C>, f3: Func<C, D>, f4: Func<D, E>, f5: Func<E, F>, f6: Func<F, G>): Func<A, G>;

function pipe(...fns: Func<any, any>[]): Func<any, any> {
  return (x: any) => fns.reduce((v, f) => f(v), x);
}

export { pipe };
