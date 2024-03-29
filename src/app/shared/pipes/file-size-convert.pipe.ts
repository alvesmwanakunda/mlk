import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSizeConvert'
})
export class FileSizeConvertPipe implements PipeTransform {

  private units: string[] = ["bytes", "Ko", "Mo", "Go", "To", "Po"];
  transform(bytes: number = 0, precision: number = 0): string {
    let result: string;
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      result = "?";
    } else {
      let unit = 0;

      while (bytes >= 1024) {
        bytes /= 1024;
        unit++;
      }

      result = bytes.toFixed(+precision) + " " + this.units[unit];
    }
    return result;
  }

}
