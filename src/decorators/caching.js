import ms from 'ms';
import promiseMemoize from 'promise-memoize';

const cacheGetConfigValues = (memoizedFn, {cacheMaxAge=ms('1m')} = options) => {

    const getConfigValues = memoizedFn;
    return promiseMemoize(getConfigValues, {maxAge: cacheMaxAge, resolve: (params) => params[0].path});
}

export default cacheGetConfigValues;