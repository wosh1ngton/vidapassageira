import { formatDate } from "@angular/common";

export class DateUtil {
    
     static dateConstructor(data: string): Date | null {
        if (!data) return null;

        // Remove asterisks and extra whitespace from AI formatting
        const cleaned = data.replace(/\*/g, '').trim();

        // Try dd/mm/yyyy format
        const barMatch = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (barMatch) {
            const res = new Date(+barMatch[3], +barMatch[2] - 1, +barMatch[1], 0, 0, 0);
            if (!isNaN(res.getTime())) return res;
        }

        // Try dd-mm-yyyy format
        const dashMatch = cleaned.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
        if (dashMatch) {
            const res = new Date(+dashMatch[3], +dashMatch[2] - 1, +dashMatch[1], 0, 0, 0);
            if (!isNaN(res.getTime())) return res;
        }

        // Try yyyy-mm-dd format (ISO-like)
        const isoMatch = cleaned.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (isoMatch) {
            const res = new Date(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3], 0, 0, 0);
            if (!isNaN(res.getTime())) return res;
        }

        return null;
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

    static localISO(data: string): string {
        const date = data;
        return formatDate(
            date,
            'yyyy-MM-ddTHH:mm:ss',
            'pt-BR'
        );
    }
}