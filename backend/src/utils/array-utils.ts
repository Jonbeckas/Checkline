export class ArrayUtils {
    static getCommonElements(array1:unknown[], array2:unknown[]):unknown[] {
        let res:unknown[]= [];
        for (let element of array1) {
            res = res.concat(array2.filter(obj => obj == element))
        }
        return res;
    }
}
