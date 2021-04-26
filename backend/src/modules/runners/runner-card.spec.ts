import * as QRCode  from "qrcode"

describe('RunnerCard', () => {

    it("Test",async ()=> {
        try {
            console.log(await QRCode.toDataURL("JUST A TEST"))
        } catch (err) {
            console.error(err)
        }
    })

})
