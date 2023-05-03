import React, { useState, useEffect } from 'react'
import './App.css'
import { sendMsgToPlugin, UIMessage } from '@messages/sender'
import {
    uploadFile
} from './upload';

function upload(list: Array<any>) {
    try {
        return new Promise(async (resolve) => {
            const imgList = [];
            for (let node of list) {
                const blob = new Blob([node.data], { type: 'image/png' });
                const file = new File([blob], node.name, { type: 'image/png' });
                const res:any = await uploadFile(file, node.name);
                const img:any = await blobToImg(blob);
                imgList.push({
                    currentSrc: img.currentSrc,
                    cdnUrl: res? res.domain+'/'+node.name : '失败'
                });
            }
            resolve(imgList);
        })

    } catch (error) {
        console.log(error);
    }
}
function blobToImg(blob: any) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.addEventListener('load', () => {
            let img: any = new Image()
            img.src = reader.result
            img.addEventListener('load', () => resolve(img))
        })
        reader.readAsDataURL(blob)
    })
}

function App() {
    const [fileList, setFileList] = useState([]);
    const [imgList, setImgList] = useState([]);
    useEffect(() => {
        window.addEventListener("message", async (msg) => {
            const { data } = msg;
            if (data.type === UIMessage.EXP) {
                const rs: any = await upload(data.data);
                setImgList(rs.map((it: any) => {
                    console.log(it);
                    return {
                        src: it.currentSrc,
                        cdnUrl: it.cdnUrl
                    }
                }));
            }
            if (data.type === UIMessage.SELCTION) {
                setFileList(data.data.map((it: any) => it.name));
            }
        }, false);
    }, [])
    const handleClick = () => {
        sendMsgToPlugin({
            type: UIMessage.EXP
        });
    }
    return (
        <div className="hello">
            <div>当前选择图层</div>
            <ul>
                {
                    fileList.map((name: any, index) => {
                        return <li key={name + index}>
                            {name}
                            <p>匹配组件库结果：null</p>
                        </li>
                    })
                }
            </ul>
            <div>上传预览</div>
            <ul>
                {
                    imgList.map((it: any, index) => {
                        return  <div>
                            <img key={'img' + index} src={it.src}>
                            </img>
                            <p>{it.cdnUrl}</p>
                        </div>
                       
                    })
                }
            </ul>
            <input placeholder='输入Accesskey'></input>
            <input placeholder='输入SecretKey'></input>
            <button onClick={handleClick}>上传cdn</button>
            <input placeholder='输入对比地址'></input> <button>对比差异</button>
        </div>
    )
}
export default App
