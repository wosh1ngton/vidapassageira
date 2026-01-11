export class DateUtil {
    
     static dateConstructor(data: string): Date {
        let dataString: string = data;
        let temp: number[] =  dataString.split('/').map(Number);        
        let res: Date = new Date(temp[2], temp[1] - 1, temp[0]);         
        return res;
    }
}