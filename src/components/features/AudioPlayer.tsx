'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'

interface Track {
  _id: string
  title: string
  category: string
  soundcloudUrl?: string
  youtubeUrl?: string
  audioUrl?: string
  description?: string
  coverImage?: any
}

interface AudioPlayerProps {
  tracks: Track[]
}

const FALLBACK_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

const getSoundCloudEmbedUrl = (url?: string) => {
  if (!url) return ''
  if (url.includes('w.soundcloud.com/player/')) {
    return url
  }
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2300f0ff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`
}

const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return ''
  if (url.includes('youtube.com/embed/')) {
    return url
  }
  let videoId = ''
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1] || '')
    videoId = urlParams.get('v') || ''
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : ''
}

const getYoutubeVideoId = (url?: string) => {
  if (!url) return ''
  let videoId = ''
  if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1] || '')
    videoId = urlParams.get('v') || ''
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
  }
  return videoId
}

const getYoutubeThumbnail = (url?: string) => {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''
}

export const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  const currentTrack = tracks[currentTrackIndex]

  const rawSoundCloud = currentTrack?.soundcloudUrl || ''
  const rawYoutube = currentTrack?.youtubeUrl || ''

  const isActualYoutube = rawYoutube.includes('youtube.com') || rawYoutube.includes('youtu.be') || rawSoundCloud.includes('youtube.com') || rawSoundCloud.includes('youtu.be')
  const isActualSoundCloud = rawSoundCloud.includes('soundcloud.com') && !isActualYoutube

  const hasDirectAudio = !!currentTrack?.audioUrl
  const hasSoundCloud = isActualSoundCloud
  const hasYoutube = isActualYoutube

  const soundCloudUrl = rawSoundCloud
  const youtubeUrl = rawYoutube.includes('youtube.com') || rawYoutube.includes('youtu.be') ? rawYoutube : rawSoundCloud

  const audioSource = currentTrack?.audioUrl || (!hasSoundCloud && !hasYoutube ? FALLBACK_AUDIO : '')

  const coverUrl = currentTrack?.coverImage
    ? urlFor(currentTrack.coverImage).width(400).url()
    : hasYoutube
    ? getYoutubeThumbnail(youtubeUrl)
    : ''

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
      if (isPlaying && hasDirectAudio) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        setIsPlaying(false)
      }
    }
  }, [currentTrackIndex, hasDirectAudio])

  useEffect(() => {
    setIsIframeLoaded(false)
  }, [currentTrackIndex])

  const handlePlayPause = () => {
    if (!audioRef.current || !hasDirectAudio) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.error("Audio playback blocked or failed:", err)
      })
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleAudioEnded = () => {
    handleNextTrack()
  }

  const handleNextTrack = () => {
    if (tracks.length === 0) return
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
  }

  const handlePrevTrack = () => {
    if (tracks.length === 0) return
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || duration === 0) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = clickX / width
    const newTime = percentage * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v
    }
    if (v === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const handleToggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const activeProgressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-2xl glass-panel p-6 border border-neutral-800/50">
      <audio
        ref={audioRef}
        src={audioSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <div className="lg:col-span-1 order-2 lg:order-1 space-y-4 max-h-[350px] overflow-y-auto pr-2">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
          Playlist Showcase
        </h3>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <button
              key={track._id}
              onClick={() => {
                setCurrentTrackIndex(index)
                setIsPlaying(true)
              }}
              className={cn(
                "w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-300 cursor-pointer",
                currentTrackIndex === index
                  ? "bg-teal/5 border-teal/20 text-teal"
                  : "bg-neutral-900/30 border-neutral-800/40 text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center border",
                currentTrackIndex === index ? "border-teal bg-teal/10" : "border-neutral-800 bg-neutral-900"
              )}>
                <Music className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate leading-tight">
                  {track.title}
                </p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                  {track.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col justify-between space-y-6 lg:pl-6 lg:border-l border-neutral-800/40">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-gold px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-md">
            Currently Playing
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-3 truncate">
            {currentTrack?.title}
          </h2>
          <p className="text-sm text-neutral-400 mt-1 uppercase tracking-widest font-semibold text-teal">
            {currentTrack?.category}
          </p>
          {currentTrack?.description && (
            <p className="text-xs text-neutral-500 mt-3 italic line-clamp-2">
              "{currentTrack.description}"
            </p>
          )}
          {!hasDirectAudio && !hasSoundCloud && !hasYoutube && (
            <span className="text-[9px] text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-md inline-block mt-2 font-medium font-sans">
              Demo Preview (No custom file uploaded yet)
            </span>
          )}
          {hasSoundCloud && !hasDirectAudio && (
            <span className="text-[9px] text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2 py-0.5 rounded-md inline-block mt-2 font-semibold font-sans uppercase tracking-widest">
              SoundCloud Stream
            </span>
          )}
          {hasYoutube && !hasDirectAudio && (
            <span className="text-[9px] text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-md inline-block mt-2 font-semibold font-sans uppercase tracking-widest">
              YouTube Video
            </span>
          )}
        </div>

        {hasDirectAudio || (!hasSoundCloud && !hasYoutube) ? (
          <>
            <div className="h-16 flex items-end justify-center gap-1.5 bg-neutral-900/30 border border-neutral-950 rounded-xl p-4 overflow-hidden relative">
              {Array.from({ length: 32 }).map((_, idx) => {
                const h = 20 + Math.sin(idx) * 15 + Math.random() * 20
                return (
                  <div
                    key={idx}
                    className={cn(
                      "w-1 rounded-t-full bg-gradient-to-t from-teal to-teal/40 min-h-[4px]",
                      isPlaying ? "wave-bar" : "opacity-30"
                    )}
                    style={{
                      height: `${h}%`,
                      animationDelay: `${idx * 0.03}s`,
                      animationDuration: `${0.8 + Math.random() * 0.6}s`
                    }}
                  />
                )
              })}
            </div>

            <div className="space-y-2">
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="w-full h-1.5 bg-neutral-800 rounded-full cursor-pointer overflow-hidden relative group"
              >
                <div
                  className="h-full bg-teal absolute left-0 top-0 group-hover:bg-gold transition-colors duration-200"
                  style={{ width: `${activeProgressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-neutral-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevTrack}
                  className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-teal text-background flex items-center justify-center hover:scale-105 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-neutral-800 accent-teal rounded-lg cursor-pointer outline-none"
                />
              </div>
            </div>
          </>
        ) : hasSoundCloud ? (
          <div className="space-y-4">
            <div 
              onClick={() => {!isIframeLoaded && setIsIframeLoaded(true)}}
              className="w-full h-[166px] rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 flex items-center justify-between p-6 relative group cursor-pointer shadow-xl transition-all duration-500 hover:border-gold/30"
            >
              {!isIframeLoaded ? (
                <>
                  {/* Blurred Background Artwork */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-15 scale-110 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 opacity-40" />
                  )}

                  {/* Content container */}
                  <div className="relative z-10 flex items-center gap-5 w-full">
                    {/* Cover Art Frame */}
                    {coverUrl ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-800/60 shadow-lg relative shrink-0">
                        <img
                          src={coverUrl}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 rounded-full bg-gold text-neutral-950 flex items-center justify-center shadow-lg shadow-gold/25">
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-neutral-900/80 border border-neutral-800/60 flex items-center justify-center text-neutral-400 group-hover:border-gold/30 shrink-0 transition-all duration-300">
                        <Music className="w-6 h-6 text-gold/80" />
                      </div>
                    )}

                    {/* Titles & Details */}
                    <div className="text-left space-y-1 max-w-[55%] truncate">
                      <h3 className="text-white font-serif text-base md:text-lg font-bold tracking-wide group-hover:text-gold transition-colors duration-300 truncate">
                        {currentTrack.title}
                      </h3>
                      {currentTrack.description ? (
                        <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed whitespace-normal text-left">
                          {currentTrack.description}
                        </p>
                      ) : (
                        <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold">
                          Click to Load SoundCloud Player
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="relative z-10 shrink-0 ml-4 hidden sm:block">
                    <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 group-hover:border-gold group-hover:text-gold text-neutral-300 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all duration-300">
                      Load Player
                    </button>
                  </div>
                </>
              ) : (
                <iframe
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={getSoundCloudEmbedUrl(soundCloudUrl)}
                  className="opacity-90 hover:opacity-100 transition-opacity duration-300 w-full h-full relative z-10"
                />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 px-1">
              <span>Use SoundCloud controls for playback</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevTrack}
                  className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-md hover:text-white transition cursor-pointer"
                >
                  Prev Track
                </button>
                <button
                  onClick={handleNextTrack}
                  className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-md hover:text-white transition cursor-pointer"
                >
                  Next Track
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              onClick={() => {!isIframeLoaded && setIsIframeLoaded(true)}}
              className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 flex flex-col items-center justify-center relative group cursor-pointer shadow-lg transition-all duration-500 hover:border-gold/30"
            >
              {!isIframeLoaded ? (
                <>
                  {/* Blurred Background Artwork */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 opacity-40" />
                  )}

                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                  {/* Content container */}
                  <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-5">
                    {/* Album Art Frame */}
                    {coverUrl ? (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-neutral-800/60 shadow-2xl relative">
                        <img
                          src={coverUrl}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 rounded-full bg-gold text-neutral-950 flex items-center justify-center shadow-lg shadow-gold/25">
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-neutral-900/80 border border-neutral-800/60 flex items-center justify-center text-neutral-400 group-hover:border-gold/30 transition-all duration-300 group-hover:scale-105 shadow-inner">
                        <Music className="w-8 h-8 text-gold/80" />
                      </div>
                    )}

                    {/* Titles */}
                    <div className="space-y-1.5 max-w-sm">
                      <h3 className="text-white font-serif text-base md:text-lg font-bold tracking-wide group-hover:text-gold transition-colors duration-300">
                        {currentTrack.title}
                      </h3>
                      {currentTrack.description ? (
                        <p className="text-neutral-400 text-xs line-clamp-1 leading-relaxed">
                          {currentTrack.description}
                        </p>
                      ) : (
                        <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">
                          YouTube Video Embed
                        </p>
                      )}
                    </div>

                    {/* Action link */}
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-gold transition-colors duration-300">
                      <Play className="w-3 h-3 fill-current" />
                      Play Video Preview
                    </span>
                  </div>
                </>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYoutubeEmbedUrl(youtubeUrl)}
                  title={currentTrack.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full relative z-10"
                />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 px-1">
              <span>Use YouTube controls for playback</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevTrack}
                  className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-md hover:text-white transition cursor-pointer"
                >
                  Prev Track
                </button>
                <button
                  onClick={handleNextTrack}
                  className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-md hover:text-white transition cursor-pointer"
                >
                  Next Track
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
