'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react';

interface ShareButtonProps {
  algorithmName?: string;
  isDarkMode?: boolean;
}

export default function ShareButton({ algorithmName, isDarkMode }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = 'https://sortshroom.vercel.app';
  const shareText = algorithmName 
    ? `${algorithmName}をきのこで学ぼう！🍄 SortShroom - きのこで学ぶソートアルゴリズム図鑑`
    : 'きのこで学ぶソートアルゴリズム図鑑 🍄 SortShroom';
  
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(baseUrl);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=ソートアルゴリズム,プログラミング学習,SortShroom`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${baseUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
    }
  };

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      copyToClipboard();
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDarkMode 
            ? 'bg-slate-700 hover:bg-slate-600 text-emerald-400 border border-slate-600' 
            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}
        title="シェア"
      >
        <Share2 size={20} />
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* シェアメニュー */}
          <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border z-50 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-emerald-200'
          }`}>
            <div className="p-3">
              <h3 className={`text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                シェアする
              </h3>
              
              <div className="space-y-2">
                {/* Twitter */}
                <button
                  onClick={() => handleShare('twitter')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-gray-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                    <Twitter size={16} fill="white" className="text-white" />
                  </div>
                  <span className="text-sm">Twitter (X)</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleShare('facebook')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-gray-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <Facebook size={16} fill="white" className="text-white" />
                  </div>
                  <span className="text-sm">Facebook</span>
                </button>

                {/* LINE */}
                <button
                  onClick={() => handleShare('line')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-gray-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">LINE</span>
                  </div>
                  <span className="text-sm">LINE</span>
                </button>

                {/* リンクコピー */}
                <button
                  onClick={() => handleShare('copy')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-gray-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    copied ? 'bg-green-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-200')
                  }`}>
                    {copied ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <Link2 size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                    )}
                  </div>
                  <span className="text-sm">
                    {copied ? 'コピーしました！' : 'リンクをコピー'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
