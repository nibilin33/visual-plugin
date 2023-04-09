// 插件发出的消息
export enum PluginMessage {
}

//UI发出的消息
export enum UIMessage {
  HELLO = 'Hello!',
  EXP = 'export',
  SELCTION = 'selection'
}

type MessageType = {
  type: UIMessage | PluginMessage,
  data?: any;
  node?: any;
}

/**
 * 向UI发送消息
 */
export const sendMsgToUI = (data: MessageType) => {
  mg.ui.postMessage(data, "*")
}


/**
 * 向插件发送消息
 */
export const sendMsgToPlugin = (data: MessageType) => {
  parent.postMessage(data, "*")
}
