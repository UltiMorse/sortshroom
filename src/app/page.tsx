'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Moon, Sun, Play, RotateCcw, Settings, X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import ShareButton from '@/components/ShareButton';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0);
  const [mushroomData, setMushroomData] = useState([
    { id: 0, value: 60, color: 'red' },
    { id: 1, value: 30, color: 'yellow' },
    { id: 2, value: 80, color: 'red' },
    { id: 3, value: 20, color: 'yellow' },
    { id: 4, value: 90, color: 'red' },
    { id: 5, value: 40, color: 'yellow' },
    { id: 6, value: 70, color: 'red' },
    { id: 7, value: 10, color: 'yellow' },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSortCompleted, setIsSortCompleted] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [dataSize, setDataSize] = useState(8);
  const [animationSpeed, setAnimationSpeed] = useState(7); // デフォルト速度を5から7に変更
  const [activeTab, setActiveTab] = useState('explanation');
  const [showSettings, setShowSettings] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const algorithms = ['バブルソート', '選択ソート', '挿入ソート', 'マージソート', 'クイックソート', 'ヒープソート'];

  // テーマ初期化 - 初回のみ実行
  useEffect(() => {
    // デフォルトはダークモードに設定
    setIsDarkMode(true);
    document.documentElement.classList.add('dark');
    
    // Web Audio APIの初期化
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      // クリーンアップ
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // サウンド効果関数
  const playSound = useCallback((type: 'compare' | 'swap' | 'complete', pitch: number = 1) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // ユーザー操作後にAudioContextを再開
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // サウンドタイプに応じて周波数とエンベロープを設定
    switch (type) {
      case 'compare':
        // 比較音：短い高めのピコ音
        oscillator.frequency.setValueAtTime(800 * pitch, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
        
      case 'swap':
        // 交換音：ポップ音
        oscillator.frequency.setValueAtTime(400 * pitch, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600 * pitch, audioContext.currentTime + 0.05);
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
        
      case 'complete':
        // 完了音：美しいアルペジオ
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.5);
          
          osc.start(audioContext.currentTime + index * 0.1);
          osc.stop(audioContext.currentTime + index * 0.1 + 0.5);
        });
        break;
    }
  }, [soundEnabled]);

  // データをランダムに生成（useCallbackで最適化）
  const generateRandomData = useCallback((size: number) => {
    const colors = ['red', 'yellow'];
    return Array.from({ length: size }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 80) + 10,
      color: colors[i % 2] as 'red' | 'yellow',
    }));
  }, []);

  // バブルソートの実装（完了後リセットなし版）
  const bubbleSort = async () => {
    const data = [...mushroomData];
    const n = data.length;
    let comparisonsCount = 0;
    let swapsCount = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setHighlightedIndices([j, j + 1]);
        comparisonsCount++;
        setComparisons(comparisonsCount);

        const pitchRatio = (data[j].value + data[j + 1].value) / 200;
        playSound('compare', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        if (data[j].value > data[j + 1].value) {
          [data[j], data[j + 1]] = [data[j + 1], data[j]];
          swapsCount++;
          setSwaps(swapsCount);
          
          setMushroomData([...data]);
          playSound('swap', pitchRatio);

          await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
        }
      }
    }
    
    // ソート完了 - ハイライトを解除してソート状態を維持
    setHighlightedIndices([]);
    setIsPlaying(false);
    setIsSortCompleted(true);
    playSound('complete');
  };

  // 選択ソートの実装（完了後リセットなし版）
  const selectionSort = async () => {
    const data = [...mushroomData];
    const n = data.length;
    let comparisonsCount = 0;
    let swapsCount = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      setHighlightedIndices([i]);
      
      await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
      
      for (let j = i + 1; j < n; j++) {
        setHighlightedIndices([i, j, minIndex]);
        comparisonsCount++;
        setComparisons(comparisonsCount);

        const pitchRatio = (data[j].value + data[minIndex].value) / 200;
        playSound('compare', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        if (data[j].value < data[minIndex].value) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        [data[i], data[minIndex]] = [data[minIndex], data[i]];
        swapsCount++;
        setSwaps(swapsCount);
        
        setMushroomData([...data]);

        const pitchRatio = (data[i].value + data[minIndex].value) / 200;
        playSound('swap', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
      }
    }
    
    // ソート完了 - ハイライトを解除してソート状態を維持
    setHighlightedIndices([]);
    setIsPlaying(false);
    setIsSortCompleted(true);
    playSound('complete');
  };

  // 挿入ソートの実装（完了後リセットなし版）
  const insertionSort = async () => {
    const data = [...mushroomData];
    const n = data.length;
    let comparisonsCount = 0;
    let swapsCount = 0;

    for (let i = 1; i < n; i++) {
      const key = { ...data[i] };
      let j = i - 1;

      setHighlightedIndices([i]);
      
      const keyPitchRatio = key.value / 100;
      playSound('compare', keyPitchRatio);
      
      await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

      while (j >= 0 && data[j].value > key.value) {
        setHighlightedIndices([j, j + 1]);
        comparisonsCount++;
        setComparisons(comparisonsCount);

        const pitchRatio = (data[j].value + key.value) / 200;
        playSound('compare', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        data[j + 1] = data[j];
        swapsCount++;
        setSwaps(swapsCount);
        
        setMushroomData([...data]);

        playSound('swap', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
        j--;
      }
      
      data[j + 1] = key;
      setMushroomData([...data]);
      
      setHighlightedIndices([j + 1]);
      await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
    }
    
    // ソート完了 - ハイライトを解除してソート状態を維持
    setHighlightedIndices([]);
    setIsPlaying(false);
    setIsSortCompleted(true);
    playSound('complete');
  };

  // マージソートの実装（修正版 - comparisonsCountとswapsCountのスコープ修正）
  const mergeSort = async () => {
    const data = [...mushroomData];

    // カウンターをuseRefで管理してクロージャー問題を回避
    const counters = { comparisons: 0, swaps: 0 };

    const merge = async (arr: typeof data, left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        setHighlightedIndices([left + i, mid + 1 + j]);
        counters.comparisons++;
        setComparisons(counters.comparisons);

        const pitchRatio = (leftArr[i].value + rightArr[j].value) / 200;
        playSound('compare', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        counters.swaps++;
        setSwaps(counters.swaps);
        
        setMushroomData([...arr]);
        
        playSound('swap', pitchRatio);
        
        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        setMushroomData([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        setMushroomData([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
        j++;
        k++;
      }
    };

    const mergeSortHelper = async (arr: typeof data, left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(arr, left, mid);
        await mergeSortHelper(arr, mid + 1, right);
        await merge(arr, left, mid, right);
      }
    };

    await mergeSortHelper(data, 0, data.length - 1);
    
    // ソート完了 - ハイライトを解除してソート状態を維持
    setHighlightedIndices([]);
    setIsPlaying(false);
    setIsSortCompleted(true);
    playSound('complete');
  };

  // クイックソートの実装（修正版 - カウンタースコープ修正）
  const quickSort = async () => {
    const data = [...mushroomData];
    const counters = { comparisons: 0, swaps: 0 };

    const partition = async (arr: typeof data, low: number, high: number): Promise<number> => {
      const pivot = arr[high];
      let i = low - 1;

      setHighlightedIndices([high]);
      
      const pivotPitchRatio = pivot.value / 100;
      playSound('compare', pivotPitchRatio);
      
      await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

      for (let j = low; j < high; j++) {
        setHighlightedIndices([high, j]);
        counters.comparisons++;
        setComparisons(counters.comparisons);

        const pitchRatio = (arr[j].value + pivot.value) / 200;
        playSound('compare', pitchRatio);

        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        if (arr[j].value < pivot.value) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          counters.swaps++;
          setSwaps(counters.swaps);
          
          setMushroomData([...arr]);
          
          playSound('swap', pitchRatio);
          
          await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      counters.swaps++;
      setSwaps(counters.swaps);
      
      setMushroomData([...arr]);
      
      playSound('swap', pivotPitchRatio);
      
      await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

      return i + 1;
    };

    const quickSortHelper = async (arr: typeof data, low: number, high: number) => {
      if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
      }
    };

    await quickSortHelper(data, 0, data.length - 1);
    
    // ソート完了 - ハイライトを解除してソート状態を維持
    setHighlightedIndices([]);
    setIsPlaying(false);
    setIsSortCompleted(true);
    playSound('complete');
  };

  // ヒープソートの実装（修正版 - カウンタースコープ修正）
  const heapSort = async () => {
    const data = [...mushroomData];
    const n = data.length;
    const counters = { comparisons: 0, swaps: 0 };

    const heapify = async (arr: typeof data, n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        setHighlightedIndices([largest, left]);
        counters.comparisons++;
        setComparisons(counters.comparisons);
        
        const pitchRatio = (arr[largest].value + arr[left].value) / 200;
        playSound('compare', pitchRatio);
        
        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        if (arr[left].value > arr[largest].value) {
          largest = left;
        }
      }

      if (right < n) {
        setHighlightedIndices([largest, right]);
        counters.comparisons++;
        setComparisons(counters.comparisons);
        
        const pitchRatio = (arr[largest].value + arr[right].value) / 200;
        playSound('compare', pitchRatio);
        
        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        if (arr[right].value > arr[largest].value) {
          largest = right;
        }
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        counters.swaps++;
        setSwaps(counters.swaps);
        
        setMushroomData([...arr]);
        
        const swapPitchRatio = (arr[i].value + arr[largest].value) / 200;
        playSound('swap', swapPitchRatio);
        
        await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

        await heapify(arr, n, largest);
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(data, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [data[0], data[i]] = [data[i], data[0]];
      counters.swaps++;
      setSwaps(counters.swaps);
      
      setMushroomData([...data]);
      
      const swapPitchRatio = (data[0].value + data[i].value) / 200;
      playSound('swap', swapPitchRatio);
      
      await new Promise(resolve => setTimeout(resolve, 1100 - animationSpeed * 100));

      await heapify(data, i, 0);
    }

    // ソート完了 - ハイライトを解除してソート状態を維持
    setHighlightedIndices([]);
    setIsPlaying(false);
    setIsSortCompleted(true);
    playSound('complete');
  };

  // ソート開始
  const startSort = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setIsSortCompleted(false);
    setComparisons(0);
    setSwaps(0);
    
    switch (selectedAlgorithm) {
      case 0:
        bubbleSort();
        break;
      case 1:
        selectionSort();
        break;
      case 2:
        insertionSort();
        break;
      case 3:
        mergeSort();
        break;
      case 4:
        quickSort();
        break;
      case 5:
        heapSort();
        break;
      default:
        alert('アルゴリズムが選択されていません');
        setIsPlaying(false);
    }
  };

  // リセット機能（useCallbackで最適化）
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setIsSortCompleted(false);
    setComparisons(0);
    setSwaps(0);
    setHighlightedIndices([]);
  }, []);

  // データサイズが変更されたときの処理（ソート完了後は自動リセットしない）
  useEffect(() => {
    // ソート中でなく、かつソート前の状態でのみデータを再生成
    if (!isPlaying) {
      // 現在のデータがソート済みかどうかをチェック
      const isSorted = mushroomData.every((mushroom, index) => 
        index === 0 || mushroom.value >= mushroomData[index - 1].value
      );
      
      // ソート済みでない場合のみ新しいデータを生成
      if (!isSorted || mushroomData.length !== dataSize) {
        setMushroomData(generateRandomData(dataSize));
        resetAnimation();
      }
    }
  }, [dataSize, generateRandomData, resetAnimation, isPlaying]);

  // リセット（手動実行のみ）
  const handleReset = () => {
    resetAnimation();
    const newData = generateRandomData(dataSize);
    setMushroomData(newData);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SortShroom - きのこで学ぶソートアルゴリズム図鑑",
            "description": "きのこをモチーフにしたアニメーションでソートアルゴリズムを直感的に学習できる教育サイト",
            "url": "https://sortshroom.vercel.app",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "JPY"
            },
            "author": {
              "@type": "Person",
              "name": "UltiMorse",
              "url": "https://ultimorse.github.io/"
            },
            "educationalUse": "プログラミング学習",
            "learningResourceType": "Interactive Resource",
            "teaches": ["ソートアルゴリズム", "プログラミング", "データ構造"],
            "inLanguage": "ja"
          })
        }}
      />
      
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-yellow-100 to-green-100 dark:from-gray-800 dark:to-gray-900 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold text-amber-800 dark:text-amber-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🍄 SortShroom - きのこソート
          </motion.h1>
          
          <div className="flex items-center gap-3">
            <ShareButton isDarkMode={isDarkMode} />
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:scale-105 transition-all border-2 border-gray-300 dark:border-gray-500 hover:shadow-xl"
              aria-label="テーマ切り替え"
            >
              {isDarkMode ? 
                <Sun className="w-6 h-6 text-yellow-500" /> : 
                <Moon className="w-6 h-6 text-gray-600" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-6">
        {/* アルゴリズム選択タブ */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border dark:border-gray-600">
            {algorithms.map((algorithm, index) => (
              <motion.button
                key={algorithm}
                onClick={() => setSelectedAlgorithm(index)}
                className={`px-4 py-2 rounded-xl font-bold transition-all border-2 shadow-md ${
                  index === selectedAlgorithm 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-200 dark:shadow-green-800 border-green-500 dark:border-emerald-500' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {algorithm}
              </motion.button>
            ))}
          </div>
        </section>

        {/* ビジュアライゼーションエリア */}
        <section className="mb-8">
          <div className="bg-gradient-to-b from-green-100 to-green-200 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg">
            {/* パフォーマンスカウンター */}
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              <div className="bg-white dark:bg-gray-600 px-4 py-2 rounded-lg shadow">
                <span className="text-sm text-gray-600 dark:text-gray-300">比較回数</span>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{comparisons}</div>
              </div>
              <div className="bg-white dark:bg-gray-600 px-4 py-2 rounded-lg shadow">
                <span className="text-sm text-gray-600 dark:text-gray-300">交換回数</span>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{swaps}</div>
              </div>
              <div className="bg-white dark:bg-gray-600 px-4 py-2 rounded-lg shadow">
                <span className="text-sm text-gray-600 dark:text-gray-300">データ数</span>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dataSize}</div>
              </div>
              <div className="bg-white dark:bg-gray-600 px-4 py-2 rounded-lg shadow">
                <span className="text-sm text-gray-600 dark:text-gray-300">速度</span>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{animationSpeed}</div>
              </div>
            </div>

            {/* きのこ配列エリア */}
            <div className="flex justify-center items-end gap-2 mb-8 min-h-[200px] bg-amber-50 dark:bg-gray-800 p-4 rounded-xl">
              {mushroomData.map((mushroom, index) => (
                <motion.div
                  key={`mushroom-${index}`}
                  className="mushroom flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: highlightedIndices.includes(index) ? 1.2 : 1,
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    scale: { duration: 0.3 }
                  }}
                >
                  {/* きのこの傘 */}
                  <div 
                    className={`w-8 h-6 rounded-t-full shadow-lg border-2 ${
                      highlightedIndices.includes(index) 
                        ? 'border-blue-500 border-4' 
                        : 'border-gray-600'
                    } ${
                      mushroom.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                  {/* きのこの柄 */}
                  <div 
                    className={`w-4 bg-amber-100 dark:bg-amber-200 border-2 rounded-b ${
                      highlightedIndices.includes(index) 
                        ? 'border-blue-500 border-4' 
                        : 'border-gray-600'
                    }`}
                    style={{ height: `${mushroom.value}px` }}
                  />
                  {/* 値表示 */}
                  <span className="text-xs mt-1 font-bold text-gray-700 dark:text-gray-300">
                    {mushroom.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* 操作パネル */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* ソート完了メッセージ */}
              {isSortCompleted && (
                <motion.div
                  className="w-full text-center mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg inline-flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <span className="font-bold">ソート完了！データは整列されました</span>
                    <span className="text-xl">🍄</span>
                  </div>
                </motion.div>
              )}

              <motion.button
                onClick={startSort}
                disabled={isPlaying}
                className={`px-6 py-3 flex items-center gap-2 font-bold rounded-xl shadow-lg transition-all ${
                  isPlaying 
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200 dark:shadow-green-800'
                } border-2 ${
                  isPlaying 
                    ? 'border-gray-300 dark:border-gray-700' 
                    : 'border-green-400 dark:border-green-500'
                }`}
                whileHover={{ scale: isPlaying ? 1 : 1.05 }}
                whileTap={{ scale: isPlaying ? 1 : 0.95 }}
              >
                <Play className="w-5 h-5" />
                {isPlaying ? 'ソート中...' : '再生'}
              </motion.button>
              
              <motion.button
                onClick={handleReset}
                disabled={isPlaying}
                className={`px-6 py-3 flex items-center gap-2 font-bold rounded-xl shadow-lg transition-all ${
                  isPlaying 
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-orange-200 dark:shadow-red-800'
                } border-2 ${
                  isPlaying 
                    ? 'border-gray-300 dark:border-gray-700' 
                    : 'border-orange-400 dark:border-red-500'
                }`}
                whileHover={{ scale: isPlaying ? 1 : 1.05 }}
                whileTap={{ scale: isPlaying ? 1 : 0.95 }}
              >
                <RotateCcw className="w-5 h-5" />
                リセット
              </motion.button>

              <motion.button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 flex items-center gap-2 font-bold rounded-xl shadow-lg transition-all bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-200 dark:shadow-purple-800 border-2 border-blue-400 dark:border-purple-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
                設定
              </motion.button>

              {/* シェアボタン */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShareButton 
                  algorithmName={algorithms[selectedAlgorithm]} 
                  isDarkMode={isDarkMode} 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 解説・コードエリア */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* タブヘッダー */}
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <button 
                onClick={() => setActiveTab('explanation')}
                className={`px-6 py-3 font-bold transition-all border-b-2 ${
                  activeTab === 'explanation'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500 shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                解説
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-6 py-3 font-bold transition-all border-b-2 ${
                  activeTab === 'code'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500 shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                コード
              </button>
            </div>

            {/* タブコンテンツ */}
            <div className="p-6">
              {activeTab === 'explanation' ? (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    {algorithms[selectedAlgorithm]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {(() => {
                      switch (selectedAlgorithm) {
                        case 0:
                          return '隣接する要素を比較し、順序が逆であれば交換することを繰り返すソートアルゴリズムです。シンプルで理解しやすいですが、効率は良くありません。';
                        case 1:
                          return '配列の中から最小値を見つけて先頭に移動することを繰り返すソートアルゴリズムです。データの移動回数が少ないのが特徴です。';
                        case 2:
                          return '整列済みの部分に新しい要素を正しい位置に挿入することを繰り返すソートアルゴリズムです。小さなデータに対して効率的です。';
                        case 3:
                          return '分割統治法を使用するソートアルゴリズムです。配列を分割し、それぞれをソートしてから結合します。安定で効率的です。';
                        case 4:
                          return 'ピボットを選んで配列を分割し、再帰的にソートするアルゴリズムです。平均的に高速ですが、最悪の場合の性能に注意が必要です。';
                        case 5:
                          return 'ヒープ構造を利用したソートアルゴリズムです。最大ヒープを構築し、最大値を取り出すことを繰り返します。';
                        default:
                          return 'アルゴリズムの説明';
                      }
                    })()}
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="font-medium text-gray-700 dark:text-gray-300 py-1">計算量(平均):</td>
                          <td className="text-gray-600 dark:text-gray-400">
                            {(() => {
                              switch (selectedAlgorithm) {
                                case 0: return 'O(n²)';
                                case 1: return 'O(n²)';
                                case 2: return 'O(n²)';
                                case 3: return 'O(n log n)';
                                case 4: return 'O(n log n)';
                                case 5: return 'O(n log n)';
                                default: return '未実装';
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700 dark:text-gray-300 py-1">計算量(最悪):</td>
                          <td className="text-gray-600 dark:text-gray-400">
                            {(() => {
                              switch (selectedAlgorithm) {
                                case 0: return 'O(n²)';
                                case 1: return 'O(n²)';
                                case 2: return 'O(n²)';
                                case 3: return 'O(n log n)';
                                case 4: return 'O(n²)';
                                case 5: return 'O(n log n)';
                                default: return '未実装';
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700 dark:text-gray-300 py-1">安定ソート:</td>
                          <td className={`${(() => {
                            switch (selectedAlgorithm) {
                              case 0: case 2: case 3: return 'text-green-600 dark:text-green-400';
                              case 1: case 4: case 5: return 'text-red-600 dark:text-red-400';
                              default: return 'text-gray-600 dark:text-gray-400';
                            }
                          })()}`}>
                            {(() => {
                              switch (selectedAlgorithm) {
                                case 0: case 2: case 3: return 'はい';
                                case 1: case 4: case 5: return 'いいえ';
                                default: return '未実装';
                              }
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    {algorithms[selectedAlgorithm]} のPythonコード
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {(() => {
                        switch (selectedAlgorithm) {
                          case 0:
                            return `def bubble_sort(mushrooms):
    """
    🍄 バブルソート - きのこが隣同士で背比べ
    隣り合うきのこを比較して、大きいきのこを右に移動
    """
    n = len(mushrooms)
    
    # すべてのきのこをチェック
    for i in range(n - 1):
        # 未ソート部分を走査
        for j in range(n - i - 1):
            # 隣のきのこと比較
            if mushrooms[j] > mushrooms[j + 1]:
                # きのこを交換 🔄
                mushrooms[j], mushrooms[j + 1] = mushrooms[j + 1], mushrooms[j]
                print(f"きのこ {mushrooms[j]} と {mushrooms[j + 1]} を交換")
    
    return mushrooms

# 使用例
forest_mushrooms = [64, 34, 25, 12, 22, 11, 90]
print("ソート前の森:", forest_mushrooms)
bubble_sort(forest_mushrooms)
print("ソート後の森:", forest_mushrooms)`;

                          case 1:
                            return `def selection_sort(mushrooms):
    """
    🍄 選択ソート - 一番小さなきのこを森の先頭へ
    毎回最小のきのこを見つけて先頭に配置
    """
    n = len(mushrooms)
    
    for i in range(n - 1):
        # 最小きのこのインデックスを記録
        min_index = i
        
        # 残りの森から最小きのこを探す
        for j in range(i + 1, n):
            if mushrooms[j] < mushrooms[min_index]:
                min_index = j
                print(f"より小さなきのこ {mushrooms[j]} を発見")
        
        # 最小きのこを正しい位置に移動
        if min_index != i:
            mushrooms[i], mushrooms[min_index] = mushrooms[min_index], mushrooms[i]
            print(f"きのこ {mushrooms[i]} を位置 {i} に配置")
    
    return mushrooms

# 使用例
forest_mushrooms = [64, 25, 12, 22, 11]
print("森の初期状態:", forest_mushrooms)
selection_sort(forest_mushrooms)
print("整列された森:", forest_mushrooms)`;

                          case 2:
                            return `def insertion_sort(mushrooms):
    """
    🍄 挿入ソート - きのこを一つずつ正しい場所に植える
    整列済みの部分に新しいきのこを適切な位置に挿入
    """
    for i in range(1, len(mushrooms)):
        current_mushroom = mushrooms[i]
        position = i
        
        print(f"きのこ {current_mushroom} の植え場所を探しています...")
        
        # 適切な位置を見つけるまで左にシフト
        while position > 0 and mushrooms[position - 1] > current_mushroom:
            mushrooms[position] = mushrooms[position - 1]
            position -= 1
            print(f"  きのこを右にずらしました")
        
        # きのこを正しい位置に植る
        mushrooms[position] = current_mushroom
        print(f"きのこ {current_mushroom} を位置 {position} に植えました 🌱")
    
    return mushrooms

# 使用例
forest_mushrooms = [12, 11, 13, 5, 6]
print("植える前の森:", forest_mushrooms)
insertion_sort(forest_mushrooms)
print("植えた後の森:", forest_mushrooms)`;

                          case 3:
                            return `def merge_sort(mushrooms):
    """
    🍄 マージソート - 森を分割して統合
    分割統治法：小さな森に分けてソートし、統合する
    """
    if len(mushrooms) <= 1:
        return mushrooms
    
    # 森を半分に分割
    mid = len(mushrooms) // 2
    left_forest = mushrooms[:mid]
    right_forest = mushrooms[mid:]
    
    print(f"森を分割: {left_forest} | {right_forest}")
    
    # 再帰的に各森をソート
    left_sorted = merge_sort(left_forest)
    right_sorted = merge_sort(right_forest)
    
    # ソートされた森を統合
    return merge_forests(left_sorted, right_sorted)

def merge_forests(left, right):
    """
    🍄 二つのソート済み森を統合
    """
    result = []
    i = j = 0
    
    print(f"森を統合中: {left} + {right}")
    
    # 両方の森にきのこがある間
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # 残りのきのこを追加
    result.extend(left[i:])
    result.extend(right[j:])
    
    print(f"統合結果: {result}")
    return result

# 使用例
forest_mushrooms = [38, 27, 43, 3, 9, 82, 10]
print("分割前の森:", forest_mushrooms)
sorted_forest = merge_sort(forest_mushrooms)
print("統合後の森:", sorted_forest)`;
                          case 4:
                            return `def quick_sort(mushrooms, low=0, high=None):
    """
    🍄 クイックソート - ピボットきのこで森を分割
    基準となるきのこを選んで、小さい・大きいグループに分ける
    """
    if high is None:
        high = len(mushrooms) - 1
    
    if low < high:
        # パーティション操作でピボット位置を取得
        pivot_index = partition(mushrooms, low, high)
        
        print(f"ピボット位置 {pivot_index} で森を分割");
        
        # ピボットの左側をソート
        quick_sort(mushrooms, low, pivot_index - 1)
        # ピボットの右側をソート
        quick_sort(mushrooms, pivot_index + 1, high)
    
    return mushrooms

def partition(mushrooms, low, high):
    """
    🍄 ピボットきのこを基準に森を分割
    """
    # 最後のきのこをピボットとして選択
    pivot = mushrooms[high]
    print(f"ピボットきのこ: {pivot}")
    
    i = low - 1  # 小さなきのこの境界
    
    for j in range(low, high):
        # 現在のきのこがピボット以下なら左側に移動
        if mushrooms[j] <= pivot:
            i += 1
            mushrooms[i], mushrooms[j] = mushrooms[j], mushrooms[i]
            print(f"きのこ {mushrooms[i]} を左側に移動")
    
    # ピボットを正しい位置に配置
    mushrooms[i + 1], mushrooms[high] = mushrooms[high], mushrooms[i + 1]
    return i + 1

# 使用例
forest_mushrooms = [10, 80, 30, 90, 40, 50, 70]
print("分割前の森:", forest_mushrooms)
quick_sort(forest_mushrooms)
print("分割後の森:", forest_mushrooms)`;
                          case 5:
                            return `def heap_sort(mushrooms):
    """
    🍄 ヒープソート - きのこの山を作って整理
    最大ヒープを構築し、最大値を取り出して整列
    """
    n = len(mushrooms)
    
    # 最大ヒープを構築（きのこの山作り）
    print("🏔️ きのこの山を構築中...")
    for i in range(n // 2 - 1, -1, -1):
        heapify(mushrooms, n, i)
    
    # ヒープから要素を一つずつ取り出し
    for i in range(n - 1, 0, -1):
        # 最大きのこ（根）を最後に移動
        mushrooms[0], mushrooms[i] = mushrooms[i], mushrooms[0]
        print(f"最大きのこ {mushrooms[i]} を取り出しました")
        
        # 残りの要素でヒープを再構築
        heapify(mushrooms, i, 0)
    
    return mushrooms

def heapify(mushrooms, heap_size, root_index):
    """
    🍄 きのこヒープの性質を維持
    親きのこは子きのこより大きくなければならない
    """
    largest = root_index
    left_child = 2 * root_index + 1
    right_child = 2 * root_index + 2
    
    # 左の子きのこが親より大きいかチェック
    if (left_child < heap_size and 
        mushrooms[left_child] > mushrooms[largest]):
        largest = left_child
    
    # 右の子きのこが現在の最大値より大きいかチェック
    if (right_child < heap_size and 
        mushrooms[right_child] > mushrooms[largest]):
        largest = right_child
    
    # 最大値が根でない場合、交換して再帰的にヒープ化
    if largest != root_index:
        mushrooms[root_index], mushrooms[largest] = mushrooms[largest], mushrooms[root_index]
        print(f"きのこの山を調整: 位置 {root_index} ↔ {largest}")
        heapify(mushrooms, heap_size, largest)

# 使用例
forest_mushrooms = [12, 11, 13, 5, 6, 7]
print("整理前のきのこの山:", forest_mushrooms)
heap_sort(forest_mushrooms)
print("整理後のきのこの山:", forest_mushrooms)`;
                          default:
                            return '# 🍄 きのこの森でソートアルゴリズムを学ぼう！\n# アルゴリズムを選択してコードを確認してください';
                        }
                      })()}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 設定モーダル */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* モーダルヘッダー */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                🍄 設定
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* 設定項目 */}
            <div className="space-y-6">
              {/* データサイズ設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  データサイズ: {dataSize}個
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={dataSize}
                  onChange={(e) => setDataSize(Number(e.target.value))}
                  disabled={isPlaying}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>30</span>
                </div>
              </div>

              {/* アニメーション速度設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  アニメーション速度: {animationSpeed}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  disabled={isPlaying}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>遅い</span>
                  <span>速い</span>
                </div>
              </div>

              {/* ステップ表示設定 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showSteps ? <Eye className="w-5 h-5 text-blue-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">ステップ表示</div>
                    <div className="text-sm text-gray-500">比較・交換のステップを詳細表示</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showSteps ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      showSteps ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* サウンド設定 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">サウンド効果</div>
                    <div className="text-sm text-gray-500">比較・交換時のサウンド</div>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors border border-gray-300 dark:border-gray-500 font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg transition-colors shadow-lg border border-amber-500 font-medium"
              >
                保存
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* フッター */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Developed by{' '}
            <a
              href="https://ultimorse.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
            >
              UltiMorse
            </a>
          </p>
          <p className="mt-1">© 2024 SortShroom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
