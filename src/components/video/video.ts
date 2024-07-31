let styles = require('./video.css')

interface Ivideo {
    url:string;
    elem:string | HTMLElement;
    width?:string;
    height?:string;
    autoplay?:boolean;
}

function video(options:Ivideo) {
    return new Video(options);
}

class Video {
    tempContainer;
    constructor(private settings:Ivideo) {
        this.settings = Object.assign({
            width:'100%',
            height:'100%',
            autoplay:false
        },this.settings)

        this.init()
    }
    init() {
        this.template()
        this.handle()
    }
    template() {
        this.tempContainer = document.createElement('div')
        this.tempContainer.className = styles.video;
        this.tempContainer.style.width=  this.settings.width
        this.tempContainer.style.height=  this.settings.height

        this.tempContainer.innerHTML = `
            <video class="${styles['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles['video-controls']}">
                <div class="${styles['video-progress']}">
                    <div class="${styles['video-progress-now']}"></div>
                    <div class="${styles['video-progress-suc']}"></div>
                    <div class="${styles['video-progress-bar']}"></div>
                </div>
                <div class="${styles['video-play']}">
                     <i class="iconfont icon-bofang"></i>
                </div>
                <div class="${styles['video-time']}">
                    <span>00:00</span>/<span>00</span>
                </div>
                
                <div class="${styles['video-full']}">
                     <i class="iconfont icon-quanping"></i>
                </div>
                
                <div class="${styles['video-volume']}">
                     <i class="iconfont icon-duomeitiicon-"></i>
                     
                      <div class="${styles['video-volprogress']}">
                       <div class="${styles['video-volprogress-now']}"></div>
                       <div class="${styles['video-volprogress-bar']}"></div>
                </div>
                </div>
            </div>
        `;
        if(typeof  this.settings.elem ==='object') {
            this.settings.elem.appendChild(this.tempContainer)
        }else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer)
        }
    }
    handle() {
        let videoContent:HTMLVideoElement =
            this.tempContainer.querySelector(`.${styles['video-content']}`);
        let videoControls =
            this.tempContainer.querySelector(`.${styles['video-controls']}`);

        let videoPlay =
            this.tempContainer.querySelector(`.${styles['video-controls']} i`);

        let videoTimes=
            this.tempContainer.querySelectorAll(`.${styles['video-time']} span`);

        let videoFull=
            this.tempContainer.querySelector(`.${styles['video-full']} i`);

        let videoProgress=
            this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`);

        let videoVolProgress=
            this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`);

        let timer;

        videoContent.volume = 0.5;

        if(this.settings.autoplay) { //是否进行自动播放
            timer = setInterval(playing,1000)
            videoContent.play()
        }

        this.tempContainer.addEventListener('mouseenter',function () {
            videoControls.style.bottom = 0;
        })
        this.tempContainer.addEventListener('mouseleave',function () {
            videoControls.style.bottom = '-50px';
        })

        //视频是否加载完毕
        videoContent.addEventListener('canplay',()=>{
            videoTimes[1].innerHTML = formatTime(videoContent.duration);
        })

        //视频播放
        videoContent.addEventListener('play',()=>{
            videoPlay.className = 'iconfont icon-ziyuan';
            timer = setInterval(playing,1000)
        })

        //视频暂停
        videoContent.addEventListener('pause',()=>{
            videoPlay.className = 'iconfont icon-bofang'
            clearInterval(timer)
        })

        videoPlay.addEventListener('click',()=>{
            if(videoContent.paused) {
                videoContent.play();
            }else {
                videoContent.pause();
            }
        })
        //全屏
        videoFull.addEventListener('click',()=>{
            videoContent.requestFullscreen()
        })

        //拖拽进度条
        videoProgress[2].addEventListener('mousedown',function(ev:MouseEvent) {
            let downX = ev.pageX;
            let downL = this.offsetLeft;


            document.onmousemove = (ev:MouseEvent)=>{
                let scale = (ev.pageX- downX+ downL+8)/this.parentNode.offsetWidth;

                if(scale<0) {
                    scale = 0;
                }else if(scale>1) {
                   scale = 1;
                }

                //拖拽进度条
                videoProgress[0].style.width = scale* 100 +'%'
                videoProgress[1].style.width = scale* 100 +'%'
                this.style.left  = scale*100 + '%'
                videoContent.currentTime =scale*videoContent.duration //拖拽时间跳转
            }
            document.onmouseup = ()=>{
                document.onmousemove = document.onmouseup = null;
            }
            ev.preventDefault(); //阻止默认事件行为
        })

        //拖拽音量
        videoVolProgress[1].addEventListener('mousedown',function(ev:MouseEvent) {
            let downX = ev.pageX;
            let downL = this.offsetLeft;

            document.onmousemove = (ev:MouseEvent)=>{
                let scale = (ev.pageX- downX+ downL+8)/this.parentNode.offsetWidth;

                if(scale<0) {
                    scale = 0;
                }else if(scale>1) {
                    scale = 1;
                }
                //拖拽进度条
                videoVolProgress[0].style.width = scale* 100 +'%'
                this.style.left = scale*100 + '%'
                videoContent.volume =scale //拖拽音量跳转

            }
            document.onmouseup = ()=>{
                document.onmousemove = document.onmouseup = null;
            }
            ev.preventDefault(); //阻止默认事件行为
        })

        //正在播放中
        function playing() {
            let scale = videoContent.currentTime/videoContent.duration; //播放进度
            let scaleSuc = videoContent.buffered.end(0)/videoContent.duration //缓存进度
            videoTimes[0].innerHTML = formatTime(videoContent.currentTime)
            videoProgress[0].style.width =scale*100 +'%';
            videoProgress[1].style.width =scaleSuc*100 +'%';
            videoProgress[2].style.left =scale*100 +'%';
        }

        //时间转换
        function formatTime(number:number):string {
            number = Math.round(number);
            let min = Math.floor(number/60)
            let sec = number%60
            return setZero(min)+':'+setZero(sec);
        }
        //补0操作
        function setZero(number:number):string {
            if(number< 10) {
                return '0'+ number
            }
            else {
                return ''+number
            }
        }
    }
}

export default video
