import './popup.css' //全局css 操作
let styles = require('./popup.css')
// import styles from './popup.css'

//ts 配置参数 接口
interface Ipopup {
    width?:string,
    heigth?:string
    title?:string
    pos?:string
    mask?:boolean
    content?:(content:HTMLElement)=>void
}

interface Icomponent {  //组件接口
    tempContainer:HTMLElement,
    init:()=>void,
    template:()=>void,
    handle:()=>void
}


function popup(options:Ipopup) {
    return new Popup(options);
}

class Popup implements Icomponent{
    tempContainer;
    mask;
    constructor(private settings:Ipopup) {
        this.settings= Object.assign({
            width:'100%',
            heigth:'100%',
            pos:'center',
            mask:true,
            content:function () {}
        },this.settings)

        this.init()
        this.handle()
        this.contentCallback()
    }
    //初始化
    init() {
        this.template()
        this.settings.mask && this.createMask();
    }
    //创建模板
    template() {
        this.tempContainer = document.createElement('div')
        this.tempContainer.style.width = this.settings.width
        this.tempContainer.style.height = this.settings.heigth
        this.tempContainer.className = styles.popup;
        this.tempContainer.innerHTML = `
            <div class="${styles['popup-title']}">
                 <h3>${this.settings.title}</h3>
                 <i class="iconfont icon-guanbi"></i>
            </div>
            <div class="${styles['popup-content']}"></div>
        `;
        document.body.appendChild(this.tempContainer);

        //位置
        if(this.settings.pos === 'center') {
            this.tempContainer.style.left =(window.innerWidth-this.tempContainer.offsetWidth)/2+'px'
            this.tempContainer.style.top =(window.innerHeight-this.tempContainer.offsetHeight)/2+'px'
        }
        if(this.settings.pos === 'left') {
            this.tempContainer.style.left =0
            this.tempContainer.style.top =(window.innerHeight-this.tempContainer.offsetHeight)+'px'
        }
        else if(this.settings.pos === 'right') {
            this.tempContainer.style.right =0
            this.tempContainer.style.top =(window.innerHeight-this.tempContainer.offsetHeight)+'px'
        }else {
            this.tempContainer.style.left =(window.innerWidth-this.tempContainer.offsetWidth)/2+'px'
            this.tempContainer.style.top =(window.innerHeight-this.tempContainer.offsetHeight)/2+'px'
        }
    }
    //事件操作
    handle(){
        let popupClose =
            this.tempContainer.querySelector(`.${styles['popup-title']} i`);

        popupClose.addEventListener('click', ()=> {
            document.body.removeChild(this.tempContainer)
            this.settings.mask && document.body.removeChild(this.mask);
        })
    }

    //创建遮罩层
    createMask() {
        this.mask = document.createElement('div')
        this.mask.className = styles.mask;
        this.mask.style.height = document.body.offsetHeight
        document.body.appendChild(this.mask)
    }

    contentCallback() {
        let popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`);
        this.settings.content(popupContent)
    }
}

export default popup
