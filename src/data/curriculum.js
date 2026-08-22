// Xưởng Phim Hoạt Hình — Bé Dâu
// Thiết kế dựa trên phân tích tâm lý thực tế:
// - Làm trước, học sau (không học lý thuyết rồi mới thực hành)
// - Mỗi buổi có sản phẩm cụ thể cầm trên tay
// - Câu chuyện + nhân vật là trung tâm (từ năng lực sẵn có của bé)
// - Đô La không hỏi lại những gì bé đã biết

export const PHASES = [
  {
    id: 1, title: 'Nhân vật & Thế giới', emoji: '🎭',
    color: '#ff6b35', bg: '#fff0eb',
    desc: 'Tạo nhân vật, xây thế giới — nền tảng của mọi bộ phim',
    days: [1,2,3,4,5]
  },
  {
    id: 2, title: 'Kịch bản & Storyboard', emoji: '📋',
    color: '#7c3aed', bg: '#f5f3ff',
    desc: 'Viết câu chuyện, vẽ khung cảnh từng cảnh phim',
    days: [6,7,8,9,10]
  },
  {
    id: 3, title: 'Làm Phim', emoji: '🎬',
    color: '#0d9488', bg: '#f0fdfa',
    desc: 'Dựng cảnh, lồng tiếng, nhạc nền — thành phim thật',
    days: [11,12,13,14,15]
  },
  {
    id: 4, title: 'Chia sẻ & Ra mắt', emoji: '🌟',
    color: '#d97706', bg: '#fffbeb',
    desc: 'Hoàn thiện, đặt tên phim, ra mắt với gia đình',
    days: [16,17,18,19,20]
  }
]

export const DAYS = [
  // ═══ PHASE 1 — NHÂN VẬT & THẾ GIỚI ═══
  {
    id: 1, phase: 1,
    title: 'Nhân vật chính của em là ai?',
    tags: ['Tạo', 'Khám phá'],
    goal: 'Tạo ra nhân vật chính với tên, tính cách, và điều đặc biệt — đây là trái tim của bộ phim.',
    mission: 'Em sẽ tạo ra nhân vật chính của bộ phim đầu tiên. Đây là việc em đã làm giỏi rồi — giống như Mika và Ly Ly ngày trước!',
    activities: [
      'Đặt tên nhân vật chính — tên gì nghe hay và dễ nhớ?',
      'Nhân vật có năng lực đặc biệt gì? (phép thuật, nấu ăn siêu giỏi, nói chuyện được với động vật...)',
      'Nhân vật sống ở đâu và muốn điều gì nhất trong cuộc đời?'
    ],
    dolaRole: 'Đô La hỏi để khám phá nhân vật, không gợi ý — nhân vật phải 100% là của em.',
    output: '📄 Thẻ nhân vật: tên + năng lực + ước mơ',
    tip: 'Nhân vật hay nhất thường có điểm mạnh rõ ràng VÀ điểm yếu thú vị!',
    tools: ['Gemini (chat để phát triển nhân vật)', 'Giấy + bút vẽ phác thảo nhân vật']
  },
  {
    id: 2, phase: 1,
    title: 'Vẽ nhân vật bằng AI',
    tags: ['Tạo', 'Công cụ AI'],
    goal: 'Biến nhân vật từ chữ thành hình ảnh thật sự — bước đầu tiên làm hoạt hình.',
    mission: 'Hôm nay em sẽ mô tả nhân vật bằng lời và nhờ AI vẽ. Xem AI có hiểu ý em không!',
    activities: [
      'Mô tả ngoại hình nhân vật chi tiết: tóc, mắt, quần áo, màu sắc yêu thích',
      'Nhờ Gemini hoặc Canva AI tạo hình ảnh nhân vật theo mô tả của em',
      'So sánh: AI vẽ có giống với hình em tưởng tượng không? Điều chỉnh mô tả để AI vẽ đúng hơn'
    ],
    dolaRole: 'Đô La giúp em học cách viết mô tả tốt hơn (prompt) để AI hiểu đúng ý.',
    output: '🖼️ Ảnh nhân vật đầu tiên do AI tạo theo ý em',
    tip: 'Mô tả càng cụ thể → AI vẽ càng đúng. Thử thêm "phong cách hoạt hình dễ thương" xem sao!',
    tools: ['Canva AI (tạo ảnh nhân vật)', 'Adobe Firefly (miễn phí)', 'Gemini (chat để điều chỉnh mô tả)']
  },
  {
    id: 3, phase: 1,
    title: 'Nhân vật phụ và kẻ phản diện',
    tags: ['Tạo', 'Sáng tạo'],
    goal: 'Câu chuyện hay cần nhiều nhân vật — người bạn đồng hành và kẻ gây khó dễ.',
    mission: 'Tạo thêm 2 nhân vật quan trọng: một người giúp nhân vật chính và một kẻ tạo ra rắc rối!',
    activities: [
      'Nhân vật phụ: ai là người bạn/người giúp của nhân vật chính? Họ quen nhau thế nào?',
      'Kẻ phản diện: không nhất thiết phải ác — có thể chỉ là người hiểu lầm, ganh tị, hay có mục tiêu khác',
      'Nhờ AI vẽ cả 3 nhân vật đứng cạnh nhau — xem họ có "hợp" với nhau không?'
    ],
    dolaRole: 'Đô La hỏi về động cơ của từng nhân vật — tại sao họ làm những gì họ làm?',
    output: '👥 Bộ 3 nhân vật hoàn chỉnh với hình ảnh',
    tip: 'Kẻ phản diện hay nhất là người ta hiểu được lý do của họ — không phải ác vô cớ!',
    tools: ['Canva AI', 'Gemini (xây dựng tính cách nhân vật phụ)']
  },
  {
    id: 4, phase: 1,
    title: 'Thế giới trong phim trông như thế nào?',
    tags: ['Tạo', 'Thiết kế'],
    goal: 'Mỗi bộ phim hay có một thế giới riêng — em sẽ thiết kế thế giới của phim mình.',
    mission: 'Hôm nay em xây dựng nơi diễn ra câu chuyện — từ phong cảnh đến màu sắc chủ đạo.',
    activities: [
      'Câu chuyện xảy ra ở đâu? (vương quốc, thành phố tương lai, đại dương, trên mây...)',
      'Màu sắc chủ đạo của thế giới đó là gì? Tươi sáng, tối tăm, hay đầy màu sắc?',
      'Nhờ AI tạo 2-3 hình nền (background) cho các cảnh quan trọng trong phim'
    ],
    dolaRole: 'Đô La hỏi về cảm xúc muốn tạo ra — thế giới tươi vui hay bí ẩn sẽ tạo cảm xúc khác nhau.',
    output: '🌍 2-3 hình nền background cho phim',
    tip: 'Thế giới trong phim thường phản chiếu nhân vật chính — vương quốc đồ ăn vì Ly Ly thích nấu ăn!',
    tools: ['Canva AI (tạo background)', 'Gemini (mô tả thế giới)']
  },
  {
    id: 5, phase: 1,
    title: 'Tổng kết Phase 1 — Bản giới thiệu nhân vật',
    tags: ['Tổng kết', 'Chia sẻ'],
    goal: 'Tổng hợp tất cả nhân vật và thế giới thành một trang giới thiệu đẹp — như poster phim thật!',
    mission: 'Em sẽ làm một trang poster giới thiệu bộ phim: tên phim, nhân vật, thế giới — như phim thật!',
    activities: [
      'Đặt tên cho bộ phim — tên nghe thú vị và muốn xem',
      'Dùng Canva ghép tất cả hình nhân vật + background thành poster phim',
      'Chia sẻ poster với ba/mẹ — nghe họ nói điều gì khiến họ muốn xem phim nhất'
    ],
    dolaRole: 'Đô La giúp em nghĩ tên phim hay — tên phim tốt thường gợi tò mò hoặc cảm xúc.',
    output: '🎬 Poster phim chính thức của bộ phim em sắp làm',
    tip: 'Poster phim thật thường có: tên phim to + hình nhân vật chính + tagline (1 câu ngắn hấp dẫn)!',
    tools: ['Canva (thiết kế poster)', 'Gemini (gợi ý tên phim và tagline)']
  },

  // ═══ PHASE 2 — KỊCH BẢN & STORYBOARD ═══
  {
    id: 6, phase: 2,
    title: 'Câu chuyện bắt đầu thế nào?',
    tags: ['Kịch bản', 'Sáng tạo'],
    goal: 'Mọi phim hay đều có opening mạnh — 30 giây đầu phải khiến người xem không muốn tắt đi.',
    mission: 'Em sẽ viết 3 cách mở đầu khác nhau cho phim, rồi chọn cái hay nhất.',
    activities: [
      'Cách 1: Bắt đầu bằng hành động — nhân vật đang làm gì kịch tính ngay đầu phim',
      'Cách 2: Bắt đầu bằng giới thiệu thế giới — cho thấy nơi diễn ra câu chuyện',
      'Cách 3: Bắt đầu bằng bí ẩn — một câu hỏi chưa có đáp án làm người xem tò mò'
    ],
    dolaRole: 'Đô La hỏi em thấy cách nào hay nhất và tại sao — không chọn thay em.',
    output: '✍️ Đoạn mở đầu phim (3-5 câu văn xuôi)',
    tip: 'Phim Frozen mở đầu bằng người chặt băng hát. Phim Coco mở đầu bằng gia đình cấm âm nhạc. Cả hai đều tạo tò mò ngay lập tức!',
    tools: ['Gemini (brainstorm ý tưởng mở đầu)', 'Giấy viết kịch bản']
  },
  {
    id: 7, phase: 2,
    title: 'Sự kiện lớn — điều gì thay đổi tất cả?',
    tags: ['Kịch bản', 'Cốt truyện'],
    goal: 'Mọi câu chuyện cần một "điểm bẻ gãy" — khoảnh khắc mọi thứ thay đổi hoàn toàn.',
    mission: 'Em sẽ xác định sự kiện lớn nhất trong phim — khoảnh khắc nhân vật chính phải thay đổi.',
    activities: [
      'Điều gì xảy ra khiến cuộc sống của nhân vật chính không còn bình thường nữa?',
      'Nhân vật có muốn điều đó xảy ra không? Họ cảm thấy thế nào?',
      'Vẽ/mô tả cảnh đó — đây sẽ là cảnh quan trọng nhất trong phim'
    ],
    dolaRole: 'Đô La hỏi về cảm xúc của nhân vật — cảm xúc thật sẽ làm người xem đồng cảm.',
    output: '⚡ Mô tả cảnh bẻ ngoặt của phim (cảnh quan trọng nhất)',
    tip: 'Trong phim Moana, điểm bẻ gãy là khi bà nội qua đời và cô chạy ra biển một mình. Phim em thế nào?',
    tools: ['Gemini (phát triển tình tiết)', 'Canva AI (tạo hình ảnh cảnh này)']
  },
  {
    id: 8, phase: 2,
    title: 'Viết kịch bản Scene 1-3',
    tags: ['Kịch bản', 'Viết'],
    goal: 'Kịch bản phim khác truyện — phải mô tả HÌNH ẢNH và HÀNH ĐỘNG, không chỉ cảm xúc.',
    mission: 'Em viết kịch bản 3 cảnh đầu tiên theo đúng format phim hoạt hình.',
    activities: [
      'Scene 1: Giới thiệu — người xem thấy ai, ở đâu, đang làm gì?',
      'Scene 2: Sự kiện kích hoạt — điều đầu tiên làm mọi thứ bắt đầu thay đổi',
      'Scene 3: Nhân vật chính phản ứng — họ quyết định làm gì?'
    ],
    dolaRole: 'Đô La dạy em sự khác biệt giữa "truyện" và "kịch bản" — kịch bản là hướng dẫn quay phim.',
    output: '📝 3 cảnh đầu tiên theo format kịch bản (SCENE/ACTION/DIALOGUE)',
    tip: 'Kịch bản viết: SCENE 1 - VỊ TRÍ - THỜI GIAN. Rồi mô tả những gì CAMERA thấy. Rồi lời thoại!',
    tools: ['Gemini (hỗ trợ viết kịch bản)', 'Google Docs hoặc giấy']
  },
  {
    id: 9, phase: 2,
    title: 'Viết kịch bản Scene 4-6 + kết thúc',
    tags: ['Kịch bản', 'Viết'],
    goal: 'Hoàn thành kịch bản — phần giữa và kết thúc của câu chuyện.',
    mission: 'Em hoàn thành toàn bộ kịch bản phim ngắn hôm nay!',
    activities: [
      'Scene 4-5: Phần gay cấn nhất — thử thách lớn nhất nhân vật phải vượt qua',
      'Scene 6: Kết thúc — nhân vật đã thay đổi thế nào so với đầu phim?',
      'Đọc lại toàn bộ kịch bản — có cảnh nào thừa? Có gì còn thiếu?'
    ],
    dolaRole: 'Đô La hỏi: nhân vật đầu phim và cuối phim có thật sự khác nhau không? Đó là dấu hiệu câu chuyện tốt.',
    output: '📝 Kịch bản hoàn chỉnh 6 cảnh',
    tip: 'Kết thúc hay: nhân vật đạt được điều họ muốn NHƯNG không theo cách họ nghĩ ban đầu!',
    tools: ['Gemini (review kịch bản)', 'Google Docs']
  },
  {
    id: 10, phase: 2,
    title: 'Storyboard — vẽ phân cảnh từng khung',
    tags: ['Storyboard', 'Thiết kế'],
    goal: 'Storyboard là bản thiết kế hình ảnh của phim — giám đốc hoạt hình dùng nó để hướng dẫn cả đội.',
    mission: 'Em vẽ storyboard cho phim — mỗi cảnh quan trọng thành 1 khung hình với mô tả ngắn.',
    activities: [
      'Chọn 6 khoảnh khắc quan trọng nhất trong phim (1 khoảnh khắc/cảnh)',
      'Vẽ phác thảo hoặc nhờ AI tạo hình cho từng khoảnh khắc đó',
      'Ghi chú ngắn: nhân vật đang nói gì? Camera đang ở góc nào?'
    ],
    dolaRole: 'Đô La giải thích góc máy quay: cận cảnh (mặt nhân vật) vs toàn cảnh (cả khung cảnh) — mỗi góc tạo cảm xúc khác.',
    output: '🎨 Storyboard 6 khung — bản thiết kế hình ảnh của phim',
    tip: 'Storyboard không cần đẹp — chỉ cần rõ ý. Pixar dùng hàng nghìn trang storyboard trước khi dựng phim!',
    tools: ['Canva AI (tạo hình từng cảnh)', 'Giấy kẻ ô vẽ storyboard']
  },

  // ═══ PHASE 3 — LÀM PHIM ═══
  {
    id: 11, phase: 3,
    title: 'Công cụ làm phim — chọn cái phù hợp nhất',
    tags: ['Công cụ', 'Học'],
    goal: 'Có nhiều công cụ làm hoạt hình miễn phí — em sẽ thử và chọn cái mình thích nhất.',
    mission: 'Thử 2 công cụ trong 30 phút mỗi cái, rồi quyết định dùng cái nào để làm phim.',
    activities: [
      'Thử Canva (kéo thả, có animation sẵn) — làm 1 slide thử với nhân vật chuyển động',
      'Thử CapCut (dựng video, có AI voiceover) — ghép 2 hình ảnh thành video ngắn',
      'Quyết định: em thích dùng cái nào hơn và tại sao?'
    ],
    dolaRole: 'Đô La không gợi ý em chọn cái nào — đây là quyết định của em dựa trên trải nghiệm thực tế.',
    output: '⚙️ Em đã thử 2 công cụ và chọn được 1 công cụ chính để làm phim',
    tip: 'Không có công cụ nào tốt nhất — chỉ có công cụ phù hợp nhất với cách em làm việc!',
    tools: ['Canva (canva.com)', 'CapCut (capcut.com)', 'Powtoon (powtoon.com — thay thế)']
  },
  {
    id: 12, phase: 3,
    title: 'Dựng Scene 1-2 thành video',
    tags: ['Làm phim', 'Thực hành'],
    goal: 'Biến kịch bản và storyboard thành những cảnh phim hoạt hình đầu tiên.',
    mission: 'Em dựng 2 cảnh đầu tiên của phim — từ hình ảnh, chuyển động, đến text trên màn hình.',
    activities: [
      'Ghép hình nhân vật + background của Scene 1 vào công cụ đã chọn',
      'Thêm chuyển động nhỏ: nhân vật di chuyển hoặc hình ảnh xuất hiện từ từ',
      'Thêm text lời thoại hoặc narration theo kịch bản Scene 1-2'
    ],
    dolaRole: 'Đô La hỏi cảm xúc khi xem thử: có giống như em tưởng tượng không? Cần thay đổi gì?',
    output: '🎬 2 cảnh đầu tiên của phim — có thể xem được!',
    tip: 'Lần đầu dựng phim sẽ không hoàn hảo — đó là bình thường. Mục tiêu là XONG, không phải HOÀN HẢO!',
    tools: ['Công cụ em đã chọn ở ngày 11', 'Hình ảnh từ Phase 1-2']
  },
  {
    id: 13, phase: 3,
    title: 'Dựng Scene 3-4 — phần gay cấn nhất',
    tags: ['Làm phim', 'Thực hành'],
    goal: 'Phần giữa phim là quan trọng nhất — đây là lúc kịch tính và cảm xúc lên cao nhất.',
    mission: 'Em dựng phần gay cấn nhất của phim hôm nay.',
    activities: [
      'Dựng Scene 3: thử thách xuất hiện — dùng hiệu ứng/âm thanh để tạo drama',
      'Dựng Scene 4: nhân vật chiến đấu/vượt qua — phần này cần nhiều chuyển động nhất',
      'Xem lại toàn bộ 4 cảnh — nhịp phim có ổn không? Nhanh hay chậm quá?'
    ],
    dolaRole: 'Đô La hỏi về "nhịp" phim — cảnh nào cần chậm lại để người xem cảm nhận cảm xúc?',
    output: '🎬 4 cảnh liên tiếp — nửa đầu phim hoàn chỉnh',
    tip: 'Cảnh buồn hoặc xúc động nên chậm hơn. Cảnh hành động nên nhanh và có nhạc mạnh!',
    tools: ['Công cụ đã chọn', 'Suno.com (tạo nhạc nền phù hợp cảm xúc từng cảnh)']
  },
  {
    id: 14, phase: 3,
    title: 'Lồng tiếng và nhạc nền',
    tags: ['Âm thanh', 'Sáng tạo'],
    goal: 'Âm thanh tạo ra 50% cảm xúc của phim — nhạc và giọng nói biến hình ảnh thành câu chuyện.',
    mission: 'Em thêm âm thanh vào phim — giọng kể chuyện hoặc lời thoại nhân vật.',
    activities: [
      'Chọn: giọng kể chuyện (narration) hay lời thoại trực tiếp từ nhân vật?',
      'Dùng CapCut AI Voiceover hoặc tự thu giọng để lồng vào video',
      'Dùng Suno.com tạo nhạc nền phù hợp với từng cảnh — nhạc vui, buồn, hay hồi hộp?'
    ],
    dolaRole: 'Đô La hỏi: khi nghe giọng nhân vật, em tưởng tượng nhân vật trông thế nào? Giọng có phù hợp không?',
    output: '🎙️ Phim có âm thanh — tiếng kể chuyện và nhạc nền',
    tip: 'Thử xem phim với volume = 0 và xem phim không có hình (chỉ nghe) — hai cách này cho thấy điểm yếu của phim ngay!',
    tools: ['CapCut (voiceover AI)', 'Suno.com (tạo nhạc)', 'Điện thoại tự thu giọng']
  },
  {
    id: 15, phase: 3,
    title: 'Dựng Scene 5-6 — kết thúc và credits',
    tags: ['Làm phim', 'Hoàn thiện'],
    goal: 'Hoàn thành toàn bộ phim — kết thúc và phần credits cuối phim.',
    mission: 'Em dựng 2 cảnh cuối và thêm credits — tên phim, tên đạo diễn (tên em!), tên AI đã giúp.',
    activities: [
      'Dựng Scene 5-6: kết thúc câu chuyện — nhân vật đạt được điều gì và thay đổi ra sao?',
      'Thêm credits cuối: "Đạo diễn: [Tên em] — AI hỗ trợ: Gemini, Canva AI, Suno"',
      'Xem phim từ đầu đến cuối một lần — ghi lại 3 điều muốn sửa'
    ],
    dolaRole: 'Đô La hỏi: em tự hào nhất về điều gì trong phim này? Điều đó quan trọng hơn mọi điểm hoàn hảo.',
    output: '🎬 Phim hoàn chỉnh — có đầu có cuối có credits!',
    tip: 'Credits cuối phim cho người xem biết ai làm phim. Đây là phim ĐẦU TIÊN của em — ghi tên thật to vào!',
    tools: ['Công cụ đã chọn', 'Hình ảnh Phase 1-2', 'Nhạc từ Suno']
  },

  // ═══ PHASE 4 — CHIA SẺ & RA MẮT ═══
  {
    id: 16, phase: 4,
    title: 'Review và chỉnh sửa cuối',
    tags: ['Hoàn thiện', 'Review'],
    goal: 'Mọi bộ phim đều qua khâu chỉnh sửa trước khi ra mắt — đây là bước làm phim trở nên tốt hơn.',
    mission: 'Em xem phim với "mắt người xem lần đầu" — không phải người đã biết câu chuyện.',
    activities: [
      'Xem phim và tưởng tượng em chưa biết câu chuyện — có hiểu ngay từ đầu không?',
      'Kiểm tra: có cảnh nào quá dài? Có đoạn nào không rõ? Text có đọc kịp không?',
      'Sửa tối đa 3 điểm — không cần sửa tất cả, chọn 3 điều quan trọng nhất'
    ],
    dolaRole: 'Đô La đặt câu hỏi của khán giả: "Tôi chưa biết nhân vật này — sao tôi nên quan tâm đến họ?"',
    output: '🎬 Phim đã được review và sửa lần cuối',
    tip: 'Steven Spielberg nói: phim hay không phải là phim không có lỗi — mà là phim mà khán giả không nhận ra lỗi!',
    tools: ['Công cụ đã dùng', 'Nhờ ba/mẹ xem và cho ý kiến']
  },
  {
    id: 17, phase: 4,
    title: 'Làm poster chính thức và trailer ngắn',
    tags: ['Marketing', 'Thiết kế'],
    goal: 'Poster và trailer là thứ khiến người ta muốn xem phim — quan trọng như bản thân phim!',
    mission: 'Em tạo poster chính thức và trailer 30 giây để "quảng cáo" phim trước buổi ra mắt.',
    activities: [
      'Cập nhật poster từ Phase 1 với hình ảnh thật sự từ phim vừa làm',
      'Chọn 5 cảnh đẹp nhất trong phim, ghép thành trailer 30 giây với nhạc hấp dẫn',
      'Viết tagline: 1 câu ngắn khiến người xem tò mò muốn xem ngay'
    ],
    dolaRole: 'Đô La hỏi: tagline cần gây TÒ MÒ hoặc CẢM XÚC — em chọn hướng nào cho phim của mình?',
    output: '🎪 Poster chính thức + trailer 30 giây',
    tip: 'Trailer Spider-Man: No Way Home không cho thấy ai xuất hiện trong phim — nhưng ai cũng muốn xem!',
    tools: ['Canva (poster)', 'CapCut (ghép trailer)', 'Suno (nhạc trailer)']
  },
  {
    id: 18, phase: 4,
    title: 'Chuẩn bị buổi ra mắt phim',
    tags: ['Ra mắt', 'Trình bày'],
    goal: 'Ra mắt phim là lúc chia sẻ thành quả với thế giới — em sẽ giới thiệu phim như một đạo diễn thật sự.',
    mission: 'Chuẩn bị bài giới thiệu ngắn 2 phút trước khi chiếu phim cho gia đình.',
    activities: [
      'Viết bài giới thiệu: "Phim tên gì, câu chuyện về ai, tại sao em muốn kể câu chuyện này"',
      'Luyện nói to, rõ ràng — không đọc giấy, chỉ nhìn tờ ghi chú',
      'Chuẩn bị không gian chiếu phim: TV hoặc máy tính, tắt đèn, chuẩn bị popcorn (tuỳ chọn!)'
    ],
    dolaRole: 'Đô La giúp em chuẩn bị câu trả lời cho câu hỏi người xem có thể hỏi sau phim.',
    output: '🎤 Bài giới thiệu phim 2 phút + không gian chiếu phim đã chuẩn bị',
    tip: 'Đạo diễn thật sự luôn giới thiệu phim trước buổi chiếu. Em là đạo diễn — em làm chủ buổi này!',
    tools: ['Giấy viết bài giới thiệu', 'TV hoặc máy tính để chiếu']
  },
  {
    id: 19, phase: 4,
    title: '🎬 Ra mắt phim chính thức!',
    tags: ['Ra mắt', 'Kỉ niệm'],
    goal: 'Buổi ra mắt phim đầu tiên trong cuộc đời của Bé Dâu — đạo diễn, nhà sản xuất, diễn viên lồng tiếng!',
    mission: 'Chiếu phim cho gia đình xem, giới thiệu 2 phút, sau đó nghe phản hồi.',
    activities: [
      'Giới thiệu phim 2 phút theo bài đã chuẩn bị',
      'Chiếu phim — ngồi cùng gia đình và quan sát phản ứng của họ',
      'Sau phim: hỏi gia đình "điều gì khiến bạn bất ngờ nhất?" và "cảnh nào bạn thích nhất?"'
    ],
    dolaRole: 'Đô La ở đây để nghe em kể lại phản hồi của gia đình — và ăn mừng cùng em!',
    output: '🎉 Buổi ra mắt phim đầu tiên đã diễn ra!',
    tip: 'Không quan trọng phim hoàn hảo hay không — quan trọng là EM đã làm được điều mà trước đây chưa ai trong gia đình từng làm!',
    tools: ['TV/máy tính', 'Gia đình', 'Cảm xúc tự hào 😊']
  },
  {
    id: 20, phase: 4,
    title: 'Phim tiếp theo — em muốn kể câu chuyện gì?',
    tags: ['Tương lai', 'Lên kế hoạch'],
    goal: 'Đạo diễn giỏi luôn đang nghĩ đến phim tiếp theo — em sẽ lên kế hoạch bộ phim thứ hai.',
    mission: 'Nhìn lại hành trình 20 ngày và lên kế hoạch cho bộ phim tiếp theo — lần này em đã biết nhiều hơn!',
    activities: [
      'Điều nào trong phim đầu tiên em muốn làm tốt hơn ở phim tiếp theo?',
      'Câu chuyện nào em muốn kể tiếp? (có thể là phần 2 của phim này, hoặc câu chuyện hoàn toàn mới)',
      'Nhờ Đô La giúp lên ý tưởng sơ bộ cho phim tiếp theo — đây là bước đầu tiên!'
    ],
    dolaRole: 'Đô La hỏi: từ bộ phim đầu tiên, em học được điều gì về cách kể chuyện mà em muốn áp dụng tiếp?',
    output: '📋 Ý tưởng sơ bộ cho bộ phim thứ 2 — hành trình không kết thúc!',
    tip: 'Miyazaki (đạo diễn Studio Ghibli) làm phim suốt 50 năm vì ông luôn có câu chuyện mới muốn kể. Em còn bao nhiêu câu chuyện trong đầu?',
    tools: ['Gemini (brainstorm ý tưởng phim 2)', 'Giấy ghi ý tưởng']
  }
]

export function getPhase(dayId) {
  return PHASES.find(p => p.days.includes(dayId)) || PHASES[0]
}

export const TOOLS_INFO = {
  'Canva (canva.com)': { url: 'https://canva.com', desc: 'Thiết kế + animation + poster' },
  'Canva (thiết kế poster)': { url: 'https://canva.com', desc: 'Thiết kế + animation + poster' },
  'Canva (poster)': { url: 'https://canva.com', desc: 'Thiết kế + animation + poster' },
  'Canva AI (tạo ảnh nhân vật)': { url: 'https://canva.com', desc: 'Tạo hình ảnh bằng AI' },
  'Canva AI (tạo background)': { url: 'https://canva.com', desc: 'Tạo hình nền bằng AI' },
  'Canva AI': { url: 'https://canva.com', desc: 'Tạo hình ảnh bằng AI' },
  'CapCut (capcut.com)': { url: 'https://capcut.com', desc: 'Dựng video + voiceover AI' },
  'CapCut (dựng video, có AI voiceover)': { url: 'https://capcut.com', desc: 'Dựng video + voiceover AI' },
  'CapCut (voiceover AI)': { url: 'https://capcut.com', desc: 'Dựng video + voiceover AI' },
  'CapCut (ghép trailer)': { url: 'https://capcut.com', desc: 'Dựng video + voiceover AI' },
  'Suno.com (tạo nhạc nền phù hợp cảm xúc từng cảnh)': { url: 'https://suno.com', desc: 'Tạo nhạc nền bằng AI' },
  'Suno.com (tạo nhạc)': { url: 'https://suno.com', desc: 'Tạo nhạc nền bằng AI' },
  'Suno (tạo nhạc nền)': { url: 'https://suno.com', desc: 'Tạo nhạc nền bằng AI' },
  'Suno (nhạc trailer)': { url: 'https://suno.com', desc: 'Tạo nhạc nền bằng AI' },
  'Suno (nhạc)': { url: 'https://suno.com', desc: 'Tạo nhạc nền bằng AI' },
  'Adobe Firefly (miễn phí)': { url: 'https://firefly.adobe.com', desc: 'Tạo ảnh AI miễn phí' },
  'Gemini (chat để phát triển nhân vật)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (xây dựng tính cách nhân vật phụ)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (mô tả thế giới)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (gợi ý tên phim và tagline)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (brainstorm ý tưởng mở đầu)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (phát triển tình tiết)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (hỗ trợ viết kịch bản)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (review kịch bản)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
  'Gemini (brainstorm ý tưởng phim 2)': { url: 'https://gemini.google.com', desc: 'AI trợ lý' },
}
