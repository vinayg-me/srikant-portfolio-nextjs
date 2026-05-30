'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Track {
  _id: string
  title: string
  category: string
  soundcloudUrl?: string
  audioUrl?: string
  description?: string
}

interface AudioPlayerProps {
  tracks: Track[]
}

const FALLBACK_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  const currentTrack = tracks[currentTrackIndex]
  const audioSource = currentTrack?.audioUrl || FALLBACK_AUDIO

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }
  }, [currentTrackIndex])

  const handlePlayPause = () => {
    if (!audioRef.current) return
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

      <div className="lg:col-span-1 space-y-4 max-h-[350px] overflow-y-auto pr-2">
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

      <div className="lg:col-span-2 flex flex-col justify-between space-y-6 lg:pl-6 lg:border-l border-neutral-800/40">
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
          {!currentTrack?.audioUrl && (
            <span className="text-[9px] text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-md inline-block mt-2 font-medium">
              Demo Preview (No custom file uploaded yet)
            </span>
          )}
        </div>

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
      </div>
    </div>
  )
}
