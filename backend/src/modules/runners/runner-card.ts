import * as Ejs from "ejs"
import * as Pdf from "html-pdf"
import * as Path from "path"
import * as QRCode from "qrcode"

export class RunnerCard {
    static getRunnerCard(username:string):Promise<Buffer> {
        return new Promise(async (resolve,reject) => {
            const template = await Ejs.renderFile(Path.join(__dirname, './template/', "template.ejs"), {image: await QRCode.toDataURL(username),username:username});
            let options = {
                "height": "148mm",
                "width": "210mm",
            };
            Pdf.create(template,options).toBuffer((err,buffer) =>{
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            })
        });
    }
}
