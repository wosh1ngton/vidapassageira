export class DateUtil {
    
     static dateConstructor(data: string): Date {
        let dataString: string = data;
        let temp: number[] =  dataString.split('/').map(Number);        
        let res: Date = new Date(temp[2], temp[1] - 1, temp[0], 0, 0, 0);         
        return res;
    }

     static dateConstructorAmericanPattern(data: string): Date {
        let dataString: string = data;
        let temp: number[] =  dataString.split('-').map(Number);
        let res: Date = new Date(temp[0], temp[1] - 1, temp[2]);
        return res;
    }

    static isoToLocalDate(iso: string): Date {
        const [datePart, timePart] = iso.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);

      return new Date(year, month - 1, day, hour, minute, second || 0);
    }
}