import { UIMessage, sendMsgToUI } from '@messages/sender'
import {
  getNodes
} from './util';

mg.showUI(__html__)

mg.ui.onmessage = (msg: { type: UIMessage, data: any }) => {
  const { type, data } = msg
  if (type === UIMessage.HELLO) {
    const textNode = mg.createText()
    textNode.characters = data
  }
  if(type === UIMessage.EXP) {
    getNodes();
  }
}
mg.on('selectionchange',()=>{
  const currentPage = mg.document.currentPage;
  const selectedNodes = currentPage.selection;
  sendMsgToUI({
    type: UIMessage.SELCTION,
    data: selectedNodes.map((it)=>{
      return {
        name: it.name+'.png'
      }
    })
  });
})