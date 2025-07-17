import TaskManager from './TaskManager';

export { TaskManager };


const optimize = (
    fn: (input: any) => any,
): any => {
    const cache = {};
    
    return (input) => {
        if (cache[input]) {
            return cache[input];
        }
        const result = fn(input);
        cache[input] = result;
        return result;
    }
}
