import React, { useState, useRef } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { MusicTrack } from '../../types';
import { presetRealRoyaltyFreeTracks } from '../../data/defaultData';
import { playTrack, stopAllAudio, getAudioContext } from '../../utils/audioSynth';
import {
  Music,
  Sparkles,
  Play,
  Pause,
  Plus,
  Trash2,
  Check,
  Radio,
  Volume2,
  Save,
  Wand2,
  ListMusic,
  Disc,
  Info,
  Loader2,
  Upload,
  FileAudio,
  Edit3,
  X,
  ExternalLink,
  VolumeX,
  FolderPlus,
  RotateCcw,
  Headphones
} from 'lucide-react';

export const MusicManager: React.FC = () => {
  const {
    audioSettings,
    updateAudioSettings,
    addMusicTrack,
    updateMusicTrack,
    deleteMusicTrack,
    setSelectedTrack,
    resetToDefaultTracks,
    saveAllData
  } = useBioSite();

  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // AI Lyria Generator State
  const [aiPrompt, setAiPrompt] = useState(
    'Trilha ambiente relaxante para estúdio de fotografia luxuoso com piano de cauda e sintetizadores suaves'
  );
  const [aiModel, setAiModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>(
    'lyria-3-clip-preview'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // Audio Upload & Add Modal/Drawer state
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'ai' | 'url'>('preset');
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadGenre, setUploadGenre] = useState('Personalizada');
  const [uploadDuration, setUploadDuration] = useState('0:30');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual URL State
  const [urlTitle, setUrlTitle] = useState('');
  const [urlGenre, setUrlGenre] = useState('');
  const [urlAddress, setUrlAddress] = useState('');

  // Editing track inline
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGenre, setEditGenre] = useState('');

  // Audio Playback
  const handleTogglePlay = (track: MusicTrack) => {
    getAudioContext();
    if (playingTrackId === track.id) {
      stopAllAudio();
      setPlayingTrackId(null);
      setPlayingPreviewUrl(null);
    } else {
      stopAllAudio();
      playTrack(track.audioUrl, audioSettings.volume || 0.5);
      setPlayingTrackId(track.id);
      setPlayingPreviewUrl(track.audioUrl);
    }
  };

  const handlePreviewUrl = (url: string) => {
    getAudioContext();
    if (playingPreviewUrl === url) {
      stopAllAudio();
      setPlayingPreviewUrl(null);
      setPlayingTrackId(null);
    } else {
      stopAllAudio();
      playTrack(url, audioSettings.volume || 0.5);
      setPlayingPreviewUrl(url);
      setPlayingTrackId('preview');
    }
  };

  // Handle Local Audio File Selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)) {
      alert('Por favor, selecione um arquivo de áudio válido (MP3, WAV, OGG, M4A, FLAC, AAC).');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setSelectedFilePreviewUrl(objectUrl);

    // Auto fill title from filename without extension
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setUploadTitle(cleanName);

    // Detect audio duration using Audio object
    const audioObj = new Audio(objectUrl);
    audioObj.onloadedmetadata = () => {
      const minutes = Math.floor(audioObj.duration / 60);
      const seconds = Math.floor(audioObj.duration % 60);
      const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      setUploadDuration(formatted);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Process File Upload to Server or Convert to Data URL
  const handleConfirmFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (selectedFile.size > 35 * 1024 * 1024) {
      alert('O arquivo selecionado é maior que 35MB. Por favor, escolha um arquivo menor.');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onerror = () => {
        setIsUploading(false);
        alert('Erro ao ler o arquivo de áudio do seu dispositivo.');
      };

      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;

        try {
          // Send to backend API
          const res = await fetch('/api/upload-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: selectedFile.name,
              fileData: base64Data,
              mimeType: selectedFile.type || 'audio/mpeg'
            })
          });

          const data = await res.json();
          let finalAudioUrl = data?.url;

          if (!res.ok || !data.success || !finalAudioUrl) {
            // Fallback: Use direct object URL or preset if network upload fails
            finalAudioUrl = selectedFilePreviewUrl || base64Data;
          }

          // Add to playlist
          addMusicTrack({
            title: uploadTitle || selectedFile.name,
            genre: uploadGenre || 'Upload MP3',
            duration: uploadDuration || '3:00',
            audioUrl: finalAudioUrl,
            isAiGenerated: false,
            enabled: true
          });

          // Reset form
          setSelectedFile(null);
          setSelectedFilePreviewUrl(null);
          setUploadTitle('');
          setUploadGenre('Personalizada');
          setIsUploading(false);
          alert('Música adicionada com sucesso à sua playlist!');
        } catch (err: any) {
          console.error(err);
          setIsUploading(false);
          // Fallback to object URL
          if (selectedFilePreviewUrl) {
            addMusicTrack({
              title: uploadTitle || selectedFile.name,
              genre: uploadGenre || 'Upload MP3',
              duration: uploadDuration || '3:00',
              audioUrl: selectedFilePreviewUrl,
              isAiGenerated: false,
              enabled: true
            });
            setSelectedFile(null);
            alert('Música adicionada com sucesso!');
          } else {
            alert('Não foi possível processar o arquivo de áudio.');
          }
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      alert('Erro ao processar o arquivo de áudio.');
    }
  };

  // AI Lyria Generation
  const handleGenerateAiMusic = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationError('');

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, model: aiModel })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao gerar a música com a IA.');
      }

      addMusicTrack({
        title: data.title || 'Trilha IA ' + (aiModel === 'lyria-3-pro-preview' ? 'Pro' : 'Clip'),
        genre: 'IA Lyria 3',
        duration: data.duration || '0:30',
        audioUrl: data.audioUrl,
        isAiGenerated: true,
        promptUsed: aiPrompt,
        modelUsed: data.modelUsed,
        enabled: true
      });

      setIsGenerating(false);
      alert('Sua nova música foi gerada pela IA Gemini Lyria e adicionada à playlist!');
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Erro ao comunicar com a API Lyria.');
      setIsGenerating(false);
    }
  };

  // Add Preset Track
  const handleAddPreset = (preset: Omit<MusicTrack, 'id'>) => {
    addMusicTrack(preset);
  };

  // Direct Play on BioSite
  const handleAddAndPlayOnBioSite = (preset: Omit<MusicTrack, 'id'>) => {
    const trackId = `track-${Date.now()}`;
    addMusicTrack({
      ...preset,
      enabled: true
    });
    setTimeout(() => {
      setSelectedTrack(trackId);
      stopAllAudio();
      playTrack(preset.audioUrl, audioSettings.volume || 0.5);
      setPlayingTrackId(trackId);
    }, 100);
  };

  // Add URL Track
  const handleAddUrlTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlAddress.trim() || !urlTitle.trim()) return;

    addMusicTrack({
      title: urlTitle,
      genre: urlGenre || 'Link Externo MP3',
      duration: '3:00',
      audioUrl: urlAddress,
      isAiGenerated: false,
      enabled: true
    });

    setUrlTitle('');
    setUrlGenre('');
    setUrlAddress('');
    alert('Link de áudio adicionado com sucesso!');
  };

  // Save Settings
  const handleSaveSettings = () => {
    stopAllAudio();
    saveAllData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Edit Track inline
  const handleStartEdit = (track: MusicTrack) => {
    setEditingTrackId(track.id);
    setEditTitle(track.title);
    setEditGenre(track.genre);
  };

  const handleSaveEdit = (id: string) => {
    updateMusicTrack(id, {
      title: editTitle,
      genre: editGenre
    });
    setEditingTrackId(null);
  };

  // Filter presets
  const filteredPresets = presetRealRoyaltyFreeTracks.filter((p) => {
    if (activeCategory === 'all') return true;
    return (p as any).category === activeCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Music className="w-7 h-7 text-amber-400" /> Trilha Sonora & Músicas Reais de Qualidade
          </h2>
          <p className="text-xs text-white/60">
            Músicas completas, piano clássico, lo-fi, bossa nova e sintetizadores com áudio cristalino e reprodução instantânea sem travamentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Restaurar o catálogo oficial de músicas de alta qualidade (Piano, Lo-Fi, Bossa Nova, Violão)?')) {
                resetToDefaultTracks();
                stopAllAudio();
                setPlayingTrackId(null);
                setPlayingPreviewUrl(null);
                alert('Catálogo de músicas de alta qualidade restaurado!');
              }
            }}
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
            title="Restaurar músicas oficiais de alta qualidade"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Catálogo Padrão</span>
          </button>

          <button
            onClick={handleSaveSettings}
            className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar no Site'}</span>
          </button>
        </div>
      </div>

      {/* MASTER MUSIC POWER SWITCH BANNER */}
      <div className={`p-6 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        audioSettings.backgroundMusicEnabled
          ? 'bg-gradient-to-r from-emerald-950/60 to-neutral-900 border-emerald-500/40 shadow-xl'
          : 'bg-gradient-to-r from-rose-950/60 to-neutral-900 border-rose-500/40 shadow-xl'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
            audioSettings.backgroundMusicEnabled
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
          }`}>
            {audioSettings.backgroundMusicEnabled ? (
              <Volume2 className="w-7 h-7 animate-pulse" />
            ) : (
              <VolumeX className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Status da Música no BioSite:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                audioSettings.backgroundMusicEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {audioSettings.backgroundMusicEnabled ? '● Ativada' : '○ Desativada (Mudo)'}
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              {audioSettings.backgroundMusicEnabled
                ? 'A trilha sonora toca no BioSite público e no player flutuante dos visitantes.'
                : 'A música está 100% desligada em todo o BioSite. Nenhum som será tocado aos visitantes.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Mute / Stop all */}
          {(playingTrackId || playingPreviewUrl) && (
            <button
              onClick={() => {
                stopAllAudio();
                setPlayingTrackId(null);
                setPlayingPreviewUrl(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
              title="Interromper som tocando no painel agora"
            >
              <VolumeX className="w-4 h-4" />
              <span>Parar Prévia</span>
            </button>
          )}

          {/* Master Toggle Button */}
          <button
            onClick={() => {
              const nextState = !audioSettings.backgroundMusicEnabled;
              updateAudioSettings({ backgroundMusicEnabled: nextState });
              if (!nextState) {
                stopAllAudio();
                setPlayingTrackId(null);
                setPlayingPreviewUrl(null);
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-lg ${
              audioSettings.backgroundMusicEnabled
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            {audioSettings.backgroundMusicEnabled ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Desativar Música</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Ativar Música no Site</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Player Controls Settings */}
      <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-6">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-amber-400" /> Configurações Gerais de Reprodução
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
            <div>
              <span className="text-sm font-bold text-white block">
                Ativar Trilha Sonora de Fundo
              </span>
              <span className="text-xs text-white/50 block">
                Exibe o player flutuante no canto inferior do BioSite público.
              </span>
            </div>
            <input
              type="checkbox"
              checked={audioSettings.backgroundMusicEnabled}
              onChange={(e) =>
                updateAudioSettings({ backgroundMusicEnabled: e.target.checked })
              }
              className="w-5 h-5 accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
            <div>
              <span className="text-sm font-bold text-white block">
                Reproduzir ao Primeiro Clique
              </span>
              <span className="text-xs text-white/50 block">
                Inicia a música automaticamente quando o visitante interage.
              </span>
            </div>
            <input
              type="checkbox"
              checked={audioSettings.autoPlayOnInteraction}
              onChange={(e) =>
                updateAudioSettings({ autoPlayOnInteraction: e.target.checked })
              }
              className="w-5 h-5 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2 flex justify-between">
            <span>Volume Padrão da Música</span>
            <span className="text-amber-400 font-bold">{Math.round((audioSettings.volume || 0.5) * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.05"
            value={audioSettings.volume || 0.5}
            onChange={(e) => updateAudioSettings({ volume: parseFloat(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Adding New Music Methods Drawer */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-amber-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-400" /> Escolher Músicas Reais de Qualidade
          </h3>

          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('preset')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Músicas de Alta Qualidade</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Enviar Meu MP3 / Arquivo</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Compor com IA (Lyria)</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Link URL</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PRESET CATALOG OF REAL HIGH QUALITY MUSIC */}
        {activeTab === 'preset' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {[
                { id: 'all', label: 'Todas as Músicas' },
                { id: 'Piano', label: '🎹 Piano Clássico' },
                { id: 'Lo-Fi', label: '☕ Lo-Fi Beats' },
                { id: 'Jazz', label: '🌴 Bossa Nova & Jazz' },
                { id: 'Acústico', label: '🎸 Violão Fingerstyle' },
                { id: 'Ambient', label: '✨ Ambient de Luxo' },
                { id: 'Eletrônico', label: '⚡ Retrowave 80s' },
                { id: 'Natureza', label: '🌊 Spa & Natureza' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-400 text-black font-bold shadow'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPresets.map((p, idx) => {
                const isPlayingThis = playingPreviewUrl === p.audioUrl;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                      isPlayingThis
                        ? 'bg-amber-500/15 border-amber-400 shadow-xl'
                        : 'bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePreviewUrl(p.audioUrl)}
                          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-lg transition transform active:scale-95 ${
                            isPlayingThis
                              ? 'bg-amber-400 text-black animate-pulse'
                              : 'bg-white/10 hover:bg-amber-400 hover:text-black text-white'
                          }`}
                          title={isPlayingThis ? 'Pausar Áudio' : 'Ouvir Música Agora'}
                        >
                          {isPlayingThis ? (
                            <Pause className="w-5 h-5 fill-black" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>

                        <div>
                          <span className="text-sm font-bold text-white block">
                            {p.title}
                          </span>
                          <span className="text-xs text-amber-300/90 font-medium block">
                            {p.genre}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] text-white/60 font-mono">
                        {p.duration}
                      </span>
                    </div>

                    {/* Active Equalizer Wave Bar */}
                    {isPlayingThis && (
                      <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/30">
                        <span className="text-[10px] text-amber-300 font-bold mr-2">Tocando Prévia:</span>
                        <div className="flex items-end gap-1 h-3.5">
                          <span className="w-1 bg-amber-400 animate-bounce h-full rounded-full"></span>
                          <span className="w-1 bg-amber-400 animate-bounce delay-75 h-2/3 rounded-full"></span>
                          <span className="w-1 bg-amber-400 animate-bounce delay-150 h-full rounded-full"></span>
                          <span className="w-1 bg-amber-400 animate-bounce delay-100 h-1/2 rounded-full"></span>
                          <span className="w-1 bg-amber-400 animate-bounce delay-200 h-3/4 rounded-full"></span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                      <button
                        onClick={() => handleAddPreset(p)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 cursor-pointer transition text-center"
                      >
                        + Adicionar à Playlist
                      </button>

                      <button
                        onClick={() => handleAddAndPlayOnBioSite(p)}
                        className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs cursor-pointer transition shadow-md whitespace-nowrap"
                      >
                        ▶ Ativar no BioSite
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <p className="text-xs text-white/70">
              Faça upload do seu próprio arquivo de áudio (<strong>MP3, WAV, M4A, OGG, AAC</strong>) diretamente do computador ou celular.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-white/20 bg-black/30 hover:border-amber-400/60 hover:bg-black/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                <FileAudio className="w-7 h-7" />
              </div>

              {selectedFile ? (
                <div>
                  <span className="text-sm font-bold text-emerald-400 block">
                    ✓ Arquivo Selecionado: {selectedFile.name}
                  </span>
                  <span className="text-xs text-white/60 block mt-1">
                    Tamanho: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Clique para trocar
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-white block">
                    Arraste seu arquivo MP3/WAV aqui ou clique para selecionar
                  </span>
                  <span className="text-xs text-white/50 block mt-1">
                    Suporta MP3, WAV, M4A, OGG, FLAC e AAC até 35MB
                  </span>
                </div>
              )}
            </div>

            {/* Selected File Preview & Settings */}
            {selectedFile && (
              <form onSubmit={handleConfirmFileUpload} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                {/* Audio Preview button */}
                {selectedFilePreviewUrl && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handlePreviewUrl(selectedFilePreviewUrl)}
                        className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center shadow font-bold cursor-pointer"
                      >
                        {playingPreviewUrl === selectedFilePreviewUrl ? (
                          <Pause className="w-5 h-5 fill-black" />
                        ) : (
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        )}
                      </button>
                      <div>
                        <span className="text-xs font-bold text-white block">Testar Áudio Selecionado</span>
                        <span className="text-[10px] text-white/50 block">Duração: {uploadDuration}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Título da Música
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Ex: Minha Trilha Autoral"
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Gênero / Categoria
                    </label>
                    <input
                      type="text"
                      value={uploadGenre}
                      onChange={(e) => setUploadGenre(e.target.value)}
                      placeholder="Ex: MPB / Acústico / Lo-Fi"
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setSelectedFilePreviewUrl(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processando Áudio...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Confirmar & Salvar na Playlist</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: AI LYRIA GENERATOR */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Crie músicas exclusivas geradas pela Inteligência Artificial <strong>Gemini Lyria 3</strong> instantaneamente!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAiModel('lyria-3-clip-preview')}
                className={`p-3 rounded-2xl text-xs text-left border transition cursor-pointer ${
                  aiModel === 'lyria-3-clip-preview'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-sm">Lyria Clip (30s)</div>
                <div className="text-[10px] text-white/50 mt-0.5">
                  Modelo curto <code className="text-amber-300">lyria-3-clip-preview</code> ideal para loops de fundo.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiModel('lyria-3-pro-preview')}
                className={`p-3 rounded-2xl text-xs text-left border transition cursor-pointer ${
                  aiModel === 'lyria-3-pro-preview'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-sm">Lyria Pro (Música Completa)</div>
                <div className="text-[10px] text-white/50 mt-0.5">
                  Modelo completo <code className="text-amber-300">lyria-3-pro-preview</code> para composições ricas.
                </div>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Descreva o estilo da música desejada (Prompt)
              </label>
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Trilha sonora relaxante de jazz suave para café gourmet com arranjo de piano de cauda e bateria suave"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:border-amber-400 focus:outline-none"
              />
            </div>

            {generationError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

            <button
              onClick={handleGenerateAiMusic}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl hover:opacity-95 disabled:opacity-50 cursor-pointer transition"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Áudio com a IA Gemini Lyria 3...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Compor Música com IA ({aiModel === 'lyria-3-pro-preview' ? 'Lyria Pro' : 'Lyria Clip'})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 4: EXTERNAL URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleAddUrlTrack} className="space-y-3">
            <p className="text-xs text-white/70">
              Cole o link direto de uma música ou arquivo de áudio hospedado na internet:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Título da Música
                </label>
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Ex: Trilha Lounge Bossa Nova"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Gênero / Estilo
                </label>
                <input
                  type="text"
                  value={urlGenre}
                  onChange={(e) => setUrlGenre(e.target.value)}
                  placeholder="Ex: Bossa Nova / Jazz"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                URL Direta do Áudio (.mp3, .wav)
              </label>
              <input
                type="url"
                value={urlAddress}
                onChange={(e) => setUrlAddress(e.target.value)}
                placeholder="https://exemplo.com/musicas/trilha-1.mp3"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 text-black font-extrabold text-xs cursor-pointer hover:bg-amber-400 transition"
            >
              Adicionar Música por URL
            </button>
          </form>
        )}
      </div>

      {/* Playlist Tracks Table/List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-amber-400" /> Playlist do BioSite ({audioSettings.tracks.length} músicas)
          </h3>

          <span className="text-xs text-white/50">
            A faixa marcada como <span className="text-emerald-400 font-bold">Ativa no Site</span> toca para seus clientes.
          </span>
        </div>

        <div className="space-y-3">
          {audioSettings.tracks.map((track) => {
            const isSelected = track.id === audioSettings.selectedTrackId;
            const isPlaying = playingTrackId === track.id;
            const isEditing = editingTrackId === track.id;

            return (
              <div
                key={track.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                    : 'bg-neutral-900/80 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Track Left Info / Play Button */}
                <div className="flex items-center gap-3.5 flex-1">
                  <button
                    onClick={() => handleTogglePlay(track)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 transition cursor-pointer shadow-md ${
                      isPlaying
                        ? 'bg-amber-400 text-black scale-105 animate-pulse'
                        : 'bg-white/10 hover:bg-amber-400 hover:text-black text-white'
                    }`}
                    title={isPlaying ? 'Pausar' : 'Ouvir Música Agora'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-black" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row gap-2 my-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-black/80 border border-amber-400 text-white text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={editGenre}
                          onChange={(e) => setEditGenre(e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/20 text-white text-xs"
                        />
                        <button
                          onClick={() => handleSaveEdit(track.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-bold text-xs"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{track.title}</h4>

                          {track.isAiGenerated && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> IA Lyria
                            </span>
                          )}

                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Ativa no Site
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-white/50 block mt-0.5">
                          {track.genre} • Duração: {track.duration || '3:00'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Track Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(track)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition border border-white/10"
                      title="Editar Título/Gênero"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isSelected ? (
                    <button
                      onClick={() => {
                        stopAllAudio();
                        updateAudioSettings({ backgroundMusicEnabled: false });
                        setPlayingTrackId(null);
                        setPlayingPreviewUrl(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 cursor-pointer transition flex items-center gap-1"
                      title="Desativar a reprodução desta música no BioSite"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Desativar no Site</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedTrack(track.id);
                        updateAudioSettings({ backgroundMusicEnabled: true });
                        stopAllAudio();
                        playTrack(track.audioUrl, audioSettings.volume || 0.5);
                        setPlayingTrackId(track.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer transition"
                    >
                      Tocar no BioSite
                    </button>
                  )}

                  <label className="flex items-center gap-1.5 text-xs text-white/70 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={track.enabled}
                      onChange={(e) =>
                        updateMusicTrack(track.id, { enabled: e.target.checked })
                      }
                      className="accent-amber-400 cursor-pointer"
                    />
                    <span>Ativa</span>
                  </label>

                  <button
                    onClick={() => {
                      if (confirm(`Excluir a música "${track.title}" da playlist?`)) {
                        deleteMusicTrack(track.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer transition"
                    title="Excluir Música"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
