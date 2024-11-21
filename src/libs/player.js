import mpegts from 'mpegts.js';
const useMpegts = true
class MTPlayer {
  url = null // 播放地址
  type = null // 播放模式 默认flv
  videoPlayer = null
  el = null
  hasAudio = null
  delay = 3
  interval = null
  /**
   *
   * @param {String} url // 播放地址
   * @param {ref} el //传入的ref视频元素
   * @param {Boolean} hasAudio // 是否有音频
   * @param {String} mode // 播放格式 默认flv
   * @param {Boolean} isLive // 是否实时流
   **/
  constructor(url, el, hasAudio, type, isLive) {
    this.url = type === 'flv' ? `${url}&prot=flv` : url
    this.type = type
    this.el = el
    this.hasAudio = hasAudio
    this.delay = isLive ? 0.2 : 3
  }

  startPlay() {
    // 开始播放
    if (useMpegts) {
      if (mpegts.isSupported()) {
        this.videoPlayer = mpegts.createPlayer(
          {
            type: this.type,
            isLive: this.isLive,
            hasVideo: true,
            // hasAudio: this.hasAudio,
            url: this.url,
            cors: true
          }, {
            enableWorker: false, // 独立线程工作
            enableWorkerForMSE: true,
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            stashInitialSize: 128,
            liveBufferLatencyChasing: true, // 追踪内部缓冲区导致的实时流延迟
            liveBufferLatencyMaxLatency: 1.5, // HTMLMediaElement 中可接受的最大缓冲区延迟（以秒为单位）之前使用flv.js发现延时严重，还有延时累加的问题
            liveBufferLatencyMinRemain: 0.3, // HTMLMediaElement 中可接受的最小缓冲区延迟（以秒为单位）
            lazyLoad: false,
            lazyLoadMaxDuration: 0.2,
            autoCleanupSourceBuffer: true
          }
        )
        this.videoPlayer.attachMediaElement(this.el);
        this.videoPlayer.load();
        this.watchVideo()
      }
    }
  }

  watchVideo() {
    this.interval = setInterval(() => {
      if (this.el.buffered.length > 0) {
        const endTime = this.el.buffered.end(0); // 缓冲时间
        const currentTime = this.el.currentTime; // 当前时间
        const timeGap = endTime - currentTime; // 时间差
        const [jumpGap, speedUpGap, maxSpeedRate] = [4, 1, 4]; // 时间超四秒以上跳转 1~4s内加速播放
        let speedRate = 1.0;
        if (timeGap > jumpGap) {
          this.el.currentTime = endTime - 1.5;
          speedRate = Math.max(1, Math.min(jumpGap, 16));
        } else if (timeGap > speedUpGap) {
          speedRate = Math.max(1, Math.min(timeGap, maxSpeedRate, 16));
        }
        this.el.playbackRate = speedRate;
      }
    }, 1000);
    // // 监听播放失败事件
    // this.videoPlayer.on('error', (event) => {
    //   console.error('播放失败:', event);

    //   if (event.type === 'network') {
    //     console.error('网络错误');
    //     // 重试或其他处理逻辑
    //   } else if (event.type === 'decode') {
    //     console.error('解码错误');
    //     // 重试或其他处理逻辑
    //   } else if (event.type === 'source') {
    //     console.error('源错误');
    //     // 重试或其他处理逻辑
    //   } else {
    //     console.error('未知错误');
    //     // 其他处理逻辑
    //   }
    // });
    // // 监听其他相关事件
    // this.videoPlayer.on('stalled', () => {
    //   console.warn('播放器卡顿');
    // });

    // this.videoPlayer.on('canplay', () => {
    //   console.log('播放器准备好播放');
    // });

    // this.videoPlayer.on('playing', () => {
    //   console.log('播放器开始播放');
    // });

    // this.videoPlayer.on('ended', () => {
    //   console.log('播放结束');
    // });
  }

  stopPlay() {
    // 停止播放
    this.videoPlayer.pause();
    this.videoPlayer.unload();
    this.videoPlayer.detachMediaElement();
    this.videoPlayer.destroy();
    this.videoPlayer = null;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null
    }
  }
}

export {
  MTPlayer
}
