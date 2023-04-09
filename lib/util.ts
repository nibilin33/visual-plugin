
import {
    sendMsgToUI,
    UIMessage
} from '@messages/sender'

export async function getNodes() {
    const currentPage = mg.document.currentPage;
    const selectedNodes = currentPage.selection;
    const pngList:any = [];
    for(let node of selectedNodes) {
        const uint8arr:any = await node.exportAsync({ format: 'PNG' });
        pngList.push({
            name: node.name+'.png',
            data: uint8arr
        });
    }
    sendMsgToUI({
        type: UIMessage.EXP,
        data: pngList
    });
}