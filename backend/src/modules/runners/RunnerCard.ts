import * as pdfMake from "pdfmake/build/pdfmake";
//@ts-ignore
import * as vfs from "../../fonts/vfs_montserrat";


export class RunnerCard {
    static getRunnerCard(username:string):Promise<string> {

        return new Promise(async (resolve,reject) => {

            let fonts = {
                Montserrat: {
                  normal: 'Montserrat-Regular.ttf',
                  bold: 'Montserrat-Regular.ttg',
                  italics: 'Montserrat-Regular.ttf',
                  bolditalics: 'Montserrat-Regular.ttf',
                },
             };
            
              let docDefinition:any = {
                pageOrientation: 'landscape',
                info: {
                    title: 'Runner card for '+username,
                    author: 'Checkline',
                  },
                defaultStyle: {
                    alignment: 'center'
                },
                content: [
                    {text: "Checkline", fontSize: 80, font:"Montserrat", margin: [ 0, 0, 0, 20 ] },
                    // basic usage
                    { qr: username,fit: '300' },

                    {text: username, fontSize: 30, font:"Montserrat", margin: [ 0, 20, 0, 0 ]}
                ]
              };
              let pdfDoc = pdfMake.createPdf(docDefinition,{},fonts,vfs.pdfMake.vfs);
              pdfDoc.getBase64(buffer => resolve(buffer));
        });
    }
}
