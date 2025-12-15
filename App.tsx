import React, { useState, useEffect } from 'react';
import { ViewMode, Product, Review } from './types';
import { ExhibitCard } from './components/ExhibitCard';
import { ProductModal } from './components/ProductModal';
import { SellerDashboard } from './components/SellerDashboard';
import { TutorialOverlay, TutorialStep } from './components/TutorialOverlay';
import { AudioControl } from './components/AudioControl';
import { Store, Search, Ticket, Loader2, HelpCircle, Landmark, Heart, LayoutGrid } from 'lucide-react';
import * as storageService from './services/storageService';

// 預設展品資料庫
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'exhibit-01',
        title: '尊爵純金一次性筷',
        description: '這款「純金一次性筷」由純金打造，專為「只用一次」的您設計，用完即丟，展現無與倫比的揮霍美學。',
        imageUrl: 'https://i.postimg.cc/0yYtdKzw/yi-ci-xing-jin-kuai.jpg',
        images: ['https://i.postimg.cc/0yYtdKzw/yi-ci-xing-jin-kuai.jpg'],
        tags: ['微型物件', '無用設計'],
        sociologyDescription: '這個作品突顯了象徵資本如何脫離物品的實用價值（Use Value）。免洗筷的實用性在於便利與廉價，但純金材質使其變得「神聖化」。設計理念是：嘲諷人們在社會場域中，如何透過物品的符號價值來展示地位並進一步階級鬥爭，揭露了資本運作的荒謬。',
        sociologyTags: ['象徵資本', '場域鬥爭', '符號價值'],
        price: 0,
        reviews: [
            { id: 'r1-1', author: '陳大師', avatar: '🎩', content: '此作品以極致的矛盾張力，將「永恆」的金屬與「暫時」的功能性結合，是對資本主義最優雅的控訴。', rating: 5, date: '2024-03-10', type: 'serious' },
            { id: 'r1-2', author: 'PTT鄉民', avatar: '🤡', content: '我就問，用這個吃泡麵會變好嗎？牙齒咬到會裂掉吧 www', rating: 3, date: '2024-03-11', type: 'funny' },
            { id: 'r1-3', author: '林阿姨', avatar: '👵', content: '夭壽喔，這金子拿去打項鍊不好嗎？用完就丟太浪費了啦！', rating: 1, date: '2024-03-12', type: 'practical' },
            { id: 'r1-4', author: '躺平青年', avatar: '👀', content: '雖然很廢，但莫名想要。這種奢華的無力感，觸。', rating: 4, date: '2024-03-13', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-02',
        title: '鑽石垃圾袋',
        description: '若您有垃圾處理需求，請選用鑽石垃圾袋，每顆微粒都鑲嵌真鑽，讓您的廢棄物也能閃耀著令人嫉妒的光芒。這是獻給頂層人士的終極任性。',
        imageUrl: 'https://i.postimg.cc/9X9y75R5/xiang-zuan-la-ji-dai.jpg',
        images: ['https://i.postimg.cc/9X9y75R5/xiang-zuan-la-ji-dai.jpg'],
        tags: ['微型物件', '無用設計'],
        sociologyDescription: '這個商品突顯了象徵資本如何脫離物品的實用價值（Use Value）。垃圾袋的實用性在於便利與廉價，但鑽石材質使其神聖化。這個作品理念在於嘲諷人們在社會場域中，透過物品的符號價值來展示地位並進行階級鬥爭，揭露了資本運作的荒謬性。',
        sociologyTags: ['象徵資本', '場域鬥爭', '符號價值'],
        price: 0,
        reviews: [
            { id: 'r2-1', author: '藝術評論家', avatar: '🧐', content: '將垃圾神聖化，這是反諷，也是一種對價值體系的解構。', rating: 5, date: '2024-02-28', type: 'serious' },
            { id: 'r2-2', author: '王大媽', avatar: '🥬', content: '這袋子裝廚餘會不會破啊？鑽石如果掉進垃圾車很可惜捏。', rating: 2, date: '2024-03-01', type: 'practical' },
            { id: 'r2-3', author: '酸民', avatar: '🤪', content: '貧窮限制了我的想像，連垃圾都比我有錢。', rating: 4, date: '2024-03-02', type: 'funny' },
            { id: 'r2-4', author: 'Z世代', avatar: '👻', content: '這什麼神操作，垃圾也要閃亮亮，大受震撼。', rating: 5, date: '2024-03-05', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-03',
        title: '馬桶造型聖水盆',
        description: '顛覆您的視覺與認知！我們將神聖的聖水盆打造為熟悉的馬桶造型，讓您在祈禱時感受衝擊性的心靈洗滌。',
        imageUrl: 'https://i.postimg.cc/J42y6pB6/ma-tong-zao-xing-sheng-shui-pen.jpg',
        images: ['https://i.postimg.cc/J42y6pB6/ma-tong-zao-xing-sheng-shui-pen.jpg'],
        tags: ['微型物件', '無用設計'],
        sociologyDescription: '設計模糊並翻轉了社會中神聖/世俗的二分法界線。社會學認為這些界線並非本質存在，而是透過權力劃分與社會建構而來。透過混淆視覺符號，揭露了這些所謂的「神聖性」其實是依靠集體力量與敘事才得以維持的。',
        sociologyTags: ['社會建構', '二分法', '神聖與世俗'],
        price: 0,
        reviews: [
            { id: 'r3-1', author: '神學教授', avatar: '🏛️', content: '這是在挑戰信仰的底線，還是試圖尋找世俗中的神性？發人深省。', rating: 4, date: '2024-03-15', type: 'serious' },
            { id: 'r3-2', author: '隔壁老王', avatar: '👴', content: '阿這不就是馬桶嗎？我才不敢用手去沾水咧。', rating: 1, date: '2024-03-16', type: 'practical' },
            { id: 'r3-3', author: '迷因大師', avatar: '🤣', content: '我就問，這水是乾淨的嗎？笑死 www', rating: 5, date: '2024-03-17', type: 'funny' },
            { id: 'r3-4', author: '厭世少女', avatar: '💀', content: '很適合我不潔的靈魂，想買。', rating: 5, date: '2024-03-18', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-04',
        title: '生人勿近之絕對防護罩 (行動蚊帳版)',
        description: '社恐人士的夢幻逸品！這款超大型穿戴裝置，展開後立即為您創造半徑 1.5 公尺的絕對淨空區。不僅物理上 100% 防疫防蚊，更能霸氣佔據捷運四個座位。穿上它，您將化身為巨大的行走茶包，雖然進不去辦公室大門，但保證沒人敢（也沒人能）靠近您半步，享受最極致的孤獨尊榮！',
        imageUrl: 'https://i.postimg.cc/8PmGscTt/ren-ti-wen-zhang.jpg',
        images: ['https://i.postimg.cc/8PmGscTt/ren-ti-wen-zhang.jpg'],
        tags: ['機械裝置', '無用設計'],
        sociologyDescription: '此道具是將現代人心理上渴望的社會距離，強行轉化為實質距離的極致表現。這個道具將隱形的心理界線（不想被打擾）具象化為可視的物理屏障。展現出現在社會中對於保持的社交距離的渴望。',
        sociologyTags: ['社會距離', '防禦性孤獨', '有機式整合'],
        price: 0,
        reviews: [
            { id: 'r4-1', author: '社會學家', avatar: '🖋️', content: '現代社會原子化的具象表現，一種悲傷的自我防禦機制。', rating: 4, date: '2024-01-20', type: 'serious' },
            { id: 'r4-2', author: '通勤族', avatar: '🎒', content: '穿這個進不了捷運閘門吧？很不方便捏。', rating: 2, date: '2024-01-21', type: 'practical' },
            { id: 'r4-3', author: '社恐人', avatar: '🥺', content: '需要這個！拜託不要跟我講話，我只想靜靜。', rating: 5, date: '2024-01-22', type: 'funny' },
            { id: 'r4-4', author: '鄉民', avatar: '🐸', content: '這根本是行走的蚊帳吧，笑死。', rating: 3, date: '2024-01-23', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-05',
        title: '「缺你不刑」命運共同體雙人椅',
        description: '考驗感情的時刻到了！這款客廳雙人椅採用殘酷的蹺蹺板原理設計。想坐得舒服？您必須找到一個願意用體重與您抗衡的夥伴。警告：一旦入座，雙方即簽訂契約，若其中一人想去上廁所而起身，另一人將面臨慘摔的命運。這是對信任與羈絆的極限挑戰。',
        imageUrl: 'https://i.postimg.cc/qR2JLLHD/que-ni-bu-xing.png',
        images: ['https://i.postimg.cc/qR2JLLHD/que-ni-bu-xing.png'],
        tags: ['空間陳設', '無用設計'],
        sociologyDescription: '此設計具象化了社會有機體中的相互依賴關係。在現代社會（有機式整合）中，我們無法獨自生存，必須依賴他人的功能（如同依賴對方的體重）來維持生活平穩。然而，這種強制的依賴關係同時也構成了一種對個人自由的束縛，顯示了社會中的連結關係。',
        sociologyTags: ['相互依賴', '有機式整合', '社會束縛'],
        price: 0,
        reviews: [
            { id: 'r5-1', author: '關係專家', avatar: '🧐', content: '強制的依賴並非真正的親密，這椅子展示了關係中的權力拉扯。', rating: 4, date: '2024-02-10', type: 'serious' },
            { id: 'r5-2', author: '陳太太', avatar: '👵', content: '這坐久了腰會痠啦，而且我老公比較重，我不就飛上天？', rating: 1, date: '2024-02-12', type: 'practical' },
            { id: 'r5-3', author: '單身狗', avatar: '🐶', content: '還好我沒有女朋友，這椅子根本是分手神器。', rating: 5, date: '2024-02-14', type: 'funny' },
            { id: 'r5-4', author: '物理系', avatar: '🤓', content: '力矩不平衡啊，這設計有料。', rating: 4, date: '2024-02-15', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-06',
        title: '《名偵探柯南》的「蝴蝶結變聲器」',
        description: '讓外表是小學生的柯南，能夠發出沈睡小五郎（成年男性）的聲音。柯南利用這個道具，躲在幕後進行案件推理與指揮。',
        imageUrl: 'https://i.postimg.cc/9FKkmj7q/ke-nan-bian-sheng-qi2-0.png',
        images: ['https://i.postimg.cc/9FKkmj7q/ke-nan-bian-sheng-qi2-0.png'],
        tags: ['館藏經典', '無用設計'],
        sociologyDescription: '這是一個瞬間擁有龐大社會資本的工具。在犯罪偵查這個場域中，小學生缺乏說話的資格與位置。變聲器強制挪用了成年男性的聲線與名偵探的社會地位（象徵資本），讓柯南得以掌控話語權。這揭示了社會有時不是聽取「真理」，而是看重發言者的「地位」與「形式」。',
        sociologyTags: ['場域', '象徵資本', '話語權'],
        price: 0,
        reviews: [
            { id: 'r6-1', author: '傳播學者', avatar: '🎩', content: '聲音作為身份的載體，此物揭露了話語權是如何被建構的。', rating: 5, date: '2024-03-01', type: 'serious' },
            { id: 'r6-2', author: '小學生', avatar: '🧢', content: '我想要這個！這樣老師就不會叫我罰站了。', rating: 5, date: '2024-03-02', type: 'practical' },
            { id: 'r6-3', author: '動漫迷', avatar: '🤓', content: '雖然不科學，但這是童年回憶啊！', rating: 5, date: '2024-03-03', type: 'funny' },
            { id: 'r6-4', author: '鄉民', avatar: '🤪', content: '所以毛利小五郎脖子後面到底有多少針孔？', rating: 4, date: '2024-03-04', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-07',
        title: '《灰姑娘》的「玻璃鞋」',
        description: '仙杜瑞拉參加舞會時穿著的魔法鞋子，材質易碎且堅硬，但神奇的是全國內只有灰姑娘的腳能完美穿進去。',
        imageUrl: 'https://i.postimg.cc/7b8SRX5D/hui-gu-niang-bo-li-xie.png',
        images: ['https://i.postimg.cc/7b8SRX5D/hui-gu-niang-bo-li-xie.png'],
        tags: ['館藏經典', '無用設計'],
        sociologyDescription: '玻璃鞋並非實用工具，而是文化資本的象徵。它代表了一種特定的品味與身體姿態。繼母的女兒們試圖削足適履，象徵著缺乏相應慣習 (Habitus) 的人，即使強行模仿上流社會的物質表象，也無法真正融入該場域。玻璃鞋是用來檢驗階級純正度與排他性的殘酷工具。',
        sociologyTags: ['文化資本', '階層流動', '慣習'],
        price: 0,
        reviews: [
            { id: 'r7-1', author: '女性主義者', avatar: '👩‍🏫', content: '這是父權審美的枷鎖，為何女性必須穿著易碎的刑具才能獲得幸福？', rating: 3, date: '2024-02-14', type: 'serious' },
            { id: 'r7-2', author: '阿嬤', avatar: '👵', content: '穿玻璃走路會割腳啦，這種鞋子不能買！', rating: 1, date: '2024-02-15', type: 'practical' },
            { id: 'r7-3', author: '理工男', avatar: '🤖', content: '硬度多少？折射率多少？穿著跑下樓梯不會碎嗎？', rating: 2, date: '2024-02-16', type: 'funny' },
            { id: 'r7-4', author: '壞姐姐', avatar: '👑', content: '好美喔～只要能嫁給王子，腳痛算什麼！', rating: 5, date: '2024-02-17', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-08',
        title: '《七龍珠》的「戰鬥力探測器」',
        description: '戴在單眼上的鏡片裝置，觀察對手時，鏡片上會跳出具體的數字，顯示對方的戰鬥力數值。',
        imageUrl: 'https://i.postimg.cc/FK78NsPp/qi-long-zhu.png',
        images: ['https://i.postimg.cc/FK78NsPp/qi-long-zhu.png'],
        tags: ['館藏經典', '無用設計'],
        sociologyDescription: '這是量測本質的體現。它建立了一種發現的邏輯，將原本肉眼看不見、模糊主觀的強弱，轉化為標準化的數據。這種量化直接決定了角色在場域中的階層地位，將身體能力轉化為可計算的資本，讓支配關係變得數據化且絕對。',
        sociologyTags: ['量化', '資本階層', '發現的邏輯'],
        price: 0,
        reviews: [
            { id: 'r8-1', author: '數據分析師', avatar: '📊', content: '將無法量化的勇氣與意志數據化，是管理主義的極致體現。', rating: 4, date: '2024-01-01', type: 'serious' },
            { id: 'r8-2', author: '弗利沙', avatar: '👽', content: '哼，戰鬥力只有5的渣渣。', rating: 1, date: '2024-01-02', type: 'funny' },
            { id: 'r8-3', author: '眼鏡行老闆', avatar: '👓', content: '這戴久了會有視差，建議配戴雙眼比較好。', rating: 2, date: '2024-01-03', type: 'practical' },
            { id: 'r8-4', author: '鄉民', avatar: '🤣', content: '快看！這裡有個人的恥力超過九千！', rating: 5, date: '2024-01-04', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-09',
        title: '《哈利波特》的「分類帽」',
        description: '一頂會說話的破舊帽子，新生入學時戴在頭上，帽子會讀取學生的思想與特質，將其分發到四個不同的學院。',
        imageUrl: 'https://i.postimg.cc/D0M7fYrq/fen-lei-mao.png',
        images: ['https://i.postimg.cc/D0M7fYrq/fen-lei-mao.png'],
        tags: ['館藏經典', '無用設計'],
        sociologyDescription: '分類帽的運作基於對慣習的判讀。它不看成績（經濟/文化資本），而是審視學生內在的性格與行事風格（如勇氣、野心）。基於「相似性」的聚集成不同學院，這種因為成員同質性高而團結的結構，展現了前現代社會機械式整合的特徵。',
        sociologyTags: ['機械式整合', '慣習', '群體歸屬'],
        price: 0,
        reviews: [
            { id: 'r9-1', author: '教育學者', avatar: '🎓', content: '這種標籤化的分流教育，是否限制了學生的多元發展？', rating: 3, date: '2024-02-20', type: 'serious' },
            { id: 'r9-2', author: '潔癖媽媽', avatar: '🧹', content: '那帽子幾百年沒洗了吧？會有頭蝨啦！', rating: 1, date: '2024-02-21', type: 'practical' },
            { id: 'r9-3', author: '蛇院生', avatar: '🐍', content: '史萊哲林！史萊哲林！純血萬歲！', rating: 5, date: '2024-02-22', type: 'funny' },
            { id: 'r9-4', author: '邊緣人', avatar: '😶', content: '如果帽子說「無處可去」，我是不是就不用上學了？', rating: 4, date: '2024-02-23', type: 'funny' }
        ]
    },
    {
        id: 'exhibit-10',
        title: '《海綿寶寶》的「神奇海螺」',
        description: '一個構造普通的塑膠玩具海螺，內建拉繩發聲裝置。但在海綿寶寶與派大星眼中，它是全知全能的神，兩人對其指示言聽計從。',
        imageUrl: 'https://i.postimg.cc/W3mD3jzh/shen-qi-hai-luo.jpg',
        images: ['https://i.postimg.cc/W3mD3jzh/shen-qi-hai-luo.jpg'],
        tags: ['館藏經典', '無用設計'],
        sociologyDescription: '這展示了世俗物品如何經過神聖化的過程。一個普通玩具經由群體的共同承諾與崇拜，被賦予了極高價值。即使海螺的回答毫無邏輯（例如「什麼都不要做」），它依然透過信徒的集體信念擁有絕對的支配權力，制約了使用者的行為。',
        sociologyTags: ['神聖化', '集體信念', '支配權力'],
        price: 0,
        reviews: [
            { id: 'r10-1', author: '宗教學者', avatar: '🙏', content: '這是對偶像崇拜最荒謬也最真實的隱喻，信仰來自於信者的投射。', rating: 5, date: '2024-03-25', type: 'serious' },
            { id: 'r10-2', author: '派大星', avatar: '⭐', content: '神奇海螺，我可以吃掉這個漢堡嗎？', rating: 5, date: '2024-03-26', type: 'funny' },
            { id: 'r10-3', author: '玩具店老闆', avatar: '🏪', content: '這批發價一個20塊，不要太迷信。', rating: 2, date: '2024-03-27', type: 'practical' },
            { id: 'r10-4', author: '迷惘社畜', avatar: '💼', content: '請問神奇海螺，我明天要不要離職？', rating: 4, date: '2024-03-28', type: 'funny' }
        ]
    }
];

const CATEGORIES = ['全部展區', '微型物件', '機械裝置', '空間陳設', '館藏經典', '未定義'];

const TUTORIAL_STEPS: TutorialStep[] = [
    {
        title: "歡迎來到無用設計博物館 🏛️",
        content: "這裡展示著各種看似怪誕但蘊含豐富社會學理論的展品",
        position: 'center'
    },
    {
        targetId: 'view-switcher',
        title: "切換身份 🎭",
        content: "點擊這裡切換「參觀者」與「館長」模式。您可以親自策展，也可以單純欣賞收藏。",
        position: 'bottom'
    },
    {
        targetId: 'tutorial-first-product-content',
        title: "鑑賞展品 ✨",
        content: "點擊任何你有興趣的展品，即可查看展品的使用說明以及社會學連結介紹。",
        position: 'top'
    },
    {
        targetId: 'tutorial-first-tag', // New Step
        title: "知識探索 🏷️",
        content: "點擊這些社會學標籤，可以探索所有具有相同概念的館藏，建立您的知識系譜。",
        position: 'bottom'
    }
];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SHOP);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部展區');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Favorites State
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      let displayProducts: Product[] = [];
      const localData = await storageService.fetchProducts();
      
      if (localData && localData.length > 0) {
          displayProducts = localData;
      } else {
          displayProducts = MOCK_PRODUCTS;
      }

      // Randomly assign 3 "Treasures" (鎮館之寶)
      const shuffledIndices = Array.from({ length: displayProducts.length }, (_, i) => i)
                              .sort(() => 0.5 - Math.random())
                              .slice(0, 3);
      
      const productsWithTreasure = displayProducts.map((p, index) => ({
          ...p,
          isTreasure: shuffledIndices.includes(index)
      }));

      setProducts(productsWithTreasure);
      
      // Load Favorites
      const storedLikes = localStorage.getItem('museum_liked_ids');
      if (storedLikes) {
          try {
              setLikedIds(new Set(JSON.parse(storedLikes)));
          } catch (e) {
              console.error("Failed to load likes", e);
          }
      }
      
      setIsLoading(false);

      const hasSeenTutorial = localStorage.getItem('has_seen_museum_tutorial');
      if (!hasSeenTutorial) {
          setTimeout(() => setShowTutorial(true), 1500);
      }
    };
    init();
  }, []);

  const handleTutorialComplete = () => {
      localStorage.setItem('has_seen_museum_tutorial', 'true');
      setShowTutorial(false);
  };

  const restartTutorial = () => {
      setViewMode(ViewMode.SHOP);
      setShowTutorial(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedProductId = params.get('product');

    if (sharedProductId && products.length > 0 && !isModalOpen) {
        const foundProduct = products.find(p => p.id === sharedProductId);
        if (foundProduct) {
            setSelectedProduct(foundProduct);
            setIsModalOpen(true);
        }
    }
  }, [products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleLike = (id: string) => {
    const newLikes = new Set(likedIds);
    if (newLikes.has(id)) {
        newLikes.delete(id);
    } else {
        newLikes.add(id);
    }
    setLikedIds(newLikes);
    localStorage.setItem('museum_liked_ids', JSON.stringify(Array.from(newLikes)));
  };

  const saveToLocal = async (newProducts: Product[]) => {
      setProducts(newProducts);
      await storageService.saveProducts(newProducts);
  };

  const handleAddProduct = (newProduct: Product) => {
    const newProducts = [newProduct, ...products];
    saveToLocal(newProducts);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveToLocal(newProducts);
    setEditingProduct(null);
  };

  const handleSubmitReview = async (productId: string, newReview: Review) => {
    const updatedProducts = products.map(p => {
        if (p.id === productId) {
            return { ...p, reviews: [newReview, ...(p.reviews || [])] };
        }
        return p;
    });
    setProducts(updatedProducts);
    
    const updatedCurrent = updatedProducts.find(p => p.id === productId);
    if (updatedCurrent) {
        setSelectedProduct(updatedCurrent);
    }

    await storageService.saveProducts(updatedProducts);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setViewMode(ViewMode.SELLER);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setSelectedCategory('全部展區'); 
    setIsModalOpen(false); 
    setViewMode(ViewMode.SHOP); // Also ensure we go back to shop if in collection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Logic
  let filteredProducts = products;
  
  if (viewMode === ViewMode.COLLECTION) {
      filteredProducts = products.filter(p => likedIds.has(p.id));
  } else {
      filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === '全部展區' || product.tags.includes(selectedCategory);
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = product.title.toLowerCase().includes(searchLower) || 
                              product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                              (product.sociologyTags && product.sociologyTags.some(tag => tag.toLowerCase().includes(searchLower)));
        return matchesCategory && matchesSearch;
      });
  }

  if (isLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 gap-4">
              <Loader2 className="animate-spin text-white" size={48} />
              <p className="font-bold text-lg animate-pulse tracking-widest">MUSEUM LOADING...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-neutral-700 selection:text-white">
      
      {/* Audio Control Overlay */}
      <AudioControl />

      <TutorialOverlay 
        isOpen={showTutorial}
        steps={TUTORIAL_STEPS}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />

      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              id="nav-logo"
              className="flex items-center gap-2 select-none cursor-pointer"
              onClick={() => { setViewMode(ViewMode.SHOP); setSearchQuery(''); setSelectedCategory('全部展區'); }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black shadow-lg bg-white shadow-neutral-800">
                <Landmark className="fill-current stroke-current" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white">
                    Useless<span className="text-neutral-500 font-light">Museum</span>
                </span>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 rounded-sm font-bold w-fit -mt-1 tracking-widest uppercase">
                    Official
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* My Collection Button */}
               <button 
                 onClick={() => setViewMode(viewMode === ViewMode.COLLECTION ? ViewMode.SHOP : ViewMode.COLLECTION)}
                 className={`p-2 rounded-full transition-colors flex items-center gap-2 px-3 font-bold border ${viewMode === ViewMode.COLLECTION ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'text-neutral-500 hover:text-white border-transparent'}`}
                 title="我的收藏館"
               >
                 <Heart size={20} className={viewMode === ViewMode.COLLECTION ? "fill-current" : ""} />
                 <span className="hidden sm:inline">收藏館</span>
                 {likedIds.size > 0 && <span className="text-xs bg-red-600 text-white px-1.5 rounded-full">{likedIds.size}</span>}
               </button>

               <button 
                 onClick={restartTutorial}
                 className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                 title="新手導覽"
               >
                 <HelpCircle size={20} />
               </button>

              <button 
                id="view-switcher"
                onClick={() => {
                    if (viewMode === ViewMode.SELLER) {
                        setViewMode(ViewMode.SHOP);
                    } else {
                        setViewMode(ViewMode.SELLER);
                        setEditingProduct(null);
                    }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border ${
                    viewMode === ViewMode.SELLER 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {viewMode === ViewMode.SELLER ? (
                  <>
                    <LayoutGrid size={18} /> <span className="hidden sm:inline">返回大廳</span>
                  </>
                ) : (
                  <>
                    <Store size={18} /> <span className="hidden sm:inline">館長後台</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {viewMode === ViewMode.SELLER ? (
          <div className="py-8 animate-[fadeIn_0.5s]">
            <SellerDashboard 
                onAddProduct={handleAddProduct} 
                onUpdateProduct={handleUpdateProduct}
                editingProduct={editingProduct}
                onCancelEdit={handleCancelEdit}
                onGoToShop={() => setViewMode(ViewMode.SHOP)}
                products={products}
            />
            
            <div className="mt-16 border-t border-neutral-800 pt-10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-white tracking-tight">館藏清點 ({products.length})</h3>
                    <p className="text-neutral-500 text-sm">點擊展品右上角筆圖示進行修復或編輯</p>
                 </div>
                 
                 {products.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-neutral-800 rounded-3xl bg-neutral-900/50">
                        <p className="text-neutral-500 font-medium">庫房空空如也，快去策畫你的第一個展覽吧！✨</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                        {products.map(product => (
                            <ExhibitCard 
                                key={product.id} 
                                product={product} 
                                onClick={handleProductClick} 
                                onEdit={handleEditProduct} 
                                onTagClick={handleTagClick}
                                isLiked={likedIds.has(product.id)}
                                onLike={handleToggleLike}
                            />
                        ))}
                    </div>
                 )}
            </div>

            <div className="text-center mt-12 pb-8 pt-8">
               <button 
                onClick={() => setViewMode(ViewMode.SHOP)}
                className="text-neutral-500 font-bold hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
               >
                 返回展覽大廳
               </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header / Hero Section (Only show in SHOP mode) */}
            {viewMode === ViewMode.SHOP && (
                <div className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-black rounded-[3rem] p-8 md:p-12 mb-12 text-white relative overflow-hidden shadow-2xl border border-neutral-800">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1 mb-6 text-xs font-bold border border-white/20 tracking-widest uppercase text-neutral-300">
                        🏛️ The Collection of Meaninglessness
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight font-serif tracking-tight">
                    觀賞無用，<br/><span className="text-neutral-400">詮釋意義。</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-400 font-light mb-10 font-serif border-l-2 border-white/20 pl-4">
                    這裡展示著各種看似怪誕但蘊含豐富社會學理論的展品，<br/>期待你的發現。
                    </p>
                    
                    <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-2 max-w-md border border-white/10 focus-within:border-white/40 transition-colors">
                    <Search className="text-neutral-400 ml-3 self-center" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜尋館藏、概念..." 
                        className="bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 w-full px-4 py-2 font-bold focus:outline-none"
                    />
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-neutral-500 opacity-10 rounded-full blur-3xl"></div>
                </div>
            )}

            {/* Collection Header */}
            {viewMode === ViewMode.COLLECTION && (
                <div className="mb-12 text-center animate-[fadeIn_0.5s]">
                    <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full text-red-500 mb-4 border border-red-500/20">
                        <Heart size={48} className="fill-current" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">您的私人收藏館</h1>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        這裡存放著觸動您靈魂的無用之物。它們或許毫無功能，但絕對充滿意義。
                    </p>
                </div>
            )}

            {/* Categories (Only in SHOP) */}
            {viewMode === ViewMode.SHOP && (
                <div id="category-filter" className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide border-b border-neutral-800">
                {CATEGORIES.map(category => (
                    <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setSearchQuery(''); }}
                    className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm tracking-wide ${
                        selectedCategory === category && searchQuery === ''
                        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                        : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 border border-neutral-800 hover:border-neutral-600'
                    }`}
                    >
                    {category}
                    </button>
                ))}
                </div>
            )}

            {searchQuery && viewMode === ViewMode.SHOP && (
              <div className="mb-8 flex items-center gap-2 animate-[fadeIn_0.3s]">
                 <span className="text-neutral-500 font-bold text-sm">檢索關鍵字:</span>
                 <span className="bg-white text-black px-4 py-1.5 rounded-full font-bold flex items-center gap-2 text-sm">
                    #{searchQuery}
                    <button onClick={() => setSearchQuery('')} className="hover:text-neutral-500 transition-colors">
                      <Search size={14} className="rotate-45" />
                    </button>
                 </span>
              </div>
            )}

            <div id="product-grid-area" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[50vh]">
              {filteredProducts.map((product, index) => (
                <ExhibitCard 
                  key={product.id} 
                  id={index === 0 && viewMode === ViewMode.SHOP ? 'tutorial-first-product-content' : undefined}
                  product={product} 
                  onClick={handleProductClick}
                  onEdit={handleEditProduct}
                  onTagClick={handleTagClick}
                  isLiked={likedIds.has(product.id)}
                  onLike={handleToggleLike}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div id="product-grid-area" className="text-center py-20 opacity-50 flex flex-col items-center">
                <div className="text-6xl mb-4 grayscale opacity-50">
                    {viewMode === ViewMode.COLLECTION ? '💔' : '🏛️'}
                </div>
                <p className="text-2xl font-bold text-neutral-500 font-serif">
                  {viewMode === ViewMode.COLLECTION 
                    ? '您的收藏館目前空無一物。' 
                    : (searchQuery ? '查無此館藏...' : '目前沒有展品。')}
                </p>
                <p className="text-sm text-neutral-600 mt-2">
                    {viewMode === ViewMode.COLLECTION 
                       ? '快去展覽大廳尋找與您產生共鳴的無用設計吧！'
                       : '館長（就是你）快去切換到「館長後台」新增展品吧！'}
                </p>
                
                {viewMode === ViewMode.COLLECTION && (
                   <button 
                    onClick={() => setViewMode(ViewMode.SHOP)}
                    className="mt-6 bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-neutral-200 transition-colors"
                   >
                     前往展覽大廳
                   </button>
                )}
                
                {viewMode === ViewMode.SHOP && searchQuery && (
                  <button 
                    onClick={() => {setSelectedCategory('全部展區'); setSearchQuery('');}}
                    className="mt-4 text-white font-bold hover:underline"
                  >
                    重置檢索條件
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-black border-t border-neutral-900 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-neutral-500 font-bold text-lg mb-2 tracking-widest uppercase">Online Useless Design Museum © 2024</p>
          <p className="text-neutral-700 text-sm font-serif italic">我們展出的不是商品，是寂寞的形狀。 🗿</p>
        </div>
      </footer>

      <ProductModal 
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => {
            setIsModalOpen(false);
            if (window.location.search.includes('product=')) {
                const url = new URL(window.location.href);
                url.searchParams.delete('product');
                window.history.pushState({}, '', url);
            }
        }}
        onSubmitReview={handleSubmitReview}
        onTagClick={handleTagClick}
      />
    </div>
  );
};

export default App;