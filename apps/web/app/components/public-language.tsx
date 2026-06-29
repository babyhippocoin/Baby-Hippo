"use client";

import { useEffect, useRef, useState } from "react";

type Language = "zh-TW" | "en";

const STORAGE_KEY = "baby-hippo-language";

const zh: Record<string, string> = {
  // Shared
  "On-chain growth community": "鏈上成長社群",
  "From Worker To On-Chain Boss": "從上班族，成為鏈上老闆",
  "From Worker": "從上班族",
  "To On-Chain Boss": "成為鏈上老闆",
  "Homepage": "首頁",
  "Home": "首頁",
  "Story": "故事",
  "DCA Planner": "定期定額規劃",
  "My Investment Plan": "我的投資計畫",
  "Create My First DCA Plan": "建立我的第一份定投計畫",
  "Choose My Exchange": "選擇我的交易所",
  "Learn Passive Income": "了解被動收入",
  "Start My Baby Hippo Journey": "開始我的 Baby Hippo 旅程",
  "Earn": "收益學習",
  "Baby Hippo Homepage": "Baby Hippo 首頁",
  "Back to Homepage": "返回首頁",
  "Community": "社群",
  "Learning Hub": "學習中心",
  "Learn": "學習",
  "Start Learning": "開始學習",
  "Start learning": "開始學習",
  "Join Community": "加入社群",
  "Read Bitcoin Guide": "閱讀比特幣指南",
  "Create My DCA Plan": "建立我的 DCA 計畫",
  "Learn Ether.fi": "學習 Ether.fi",
  "Learn Aave": "學習 Aave",
  "Read Founder Story": "閱讀創辦人故事",
  "Join Baby Hippo Community": "加入 Baby Hippo 社群",
  "View My On-Chain Boss Progress": "查看我的鏈上老闆進度",
  "Open menu": "開啟選單",
  "Close menu": "關閉選單",
  "Educational only. Not financial advice. No transactions are performed.": "僅供教育用途，不構成財務建議，也不會執行任何交易。",

  // Homepage
  "Our Story": "我們的故事",
  "Who We Build For": "我們為誰打造",
  "Products": "產品",
  "Hippo Stories": "河馬故事",
  "Our Values": "我們的價值",
  "Values": "價值",
  "An on-chain growth community for ordinary people": "為每一位努力生活的人打造的鏈上成長社群",
  "Built for everyone working hard to improve life.": "為每一位努力生活的人打造。",
  "Learn wallets, DCA, DeFi, and risk management at your own pace—with tools and a community built for real life.": "用自己的步調學習錢包、定期定額、DeFi 與風險管理，使用真正貼近日常生活的工具，也找到一起成長的社群。",
  "Education first. Risk management first. No promises of easy money.": "教育優先，風險管理優先。我們不承諾輕鬆賺錢。",
  "Education first": "教育優先",
  "Build safer habits": "建立更安全的習慣",
  "Miaoli, Taiwan": "台灣苗栗",
  "Where roads, music, and a new idea met.": "道路、音樂與一個新想法相遇的地方。",
  "Our story": "我們的故事",
  "Built from real life.": "從真實生活出發。",
  "Baby Hippo began in a rural town in Miaoli. Its founder has worked in logistics and freight transportation and teaches violin—two worlds built on responsibility, patience, and practice.": "Baby Hippo 從苗栗鄉間起步。創辦人做過物流與貨運，也教小提琴；這兩種生活都離不開責任、耐心與反覆練習。",
  "While learning DeFi and risk management, he saw how complicated and unwelcoming the on-chain world can feel to ordinary people. Too many projects begin with hype before education.": "在學習 DeFi 與風險管理的過程中，他發現鏈上世界對一般人來說常常又複雜、又有距離。太多專案先談炒作，卻沒有先把教育做好。",
  "“I am building Baby Hippo for people who work hard, want to learn, and deserve a fair place to begin.”": "「我想為認真生活、願意學習，也值得擁有公平起點的人打造 Baby Hippo。」",
  "Read why we build": "了解我們為何而做",
  "Who we build for": "我們為誰打造",
  "Built for people who keep going.": "為每天繼續努力的人而做。",
  "We do not believe only whales deserve modern financial tools. Ordinary people deserve education, risk awareness, and a place to learn too.": "我們不相信只有巨鯨才配擁有現代金融工具。一般人也值得獲得教育、風險意識，以及安心學習的空間。",
  "Truck Drivers": "貨車司機",
  "Learning designed around long roads, irregular hours, and real responsibilities.": "適合長途奔波、工時不固定，又肩負真實責任的學習方式。",
  "Workers & Logistics Teams": "勞工與物流夥伴",
  "Practical tools that respect every hour of honest work.": "尊重每一小時誠實勞動的實用工具。",
  "Music Teachers": "音樂老師",
  "Steady learning for people who patiently help others grow.": "獻給耐心陪伴他人成長，也想穩定學習的人。",
  "Small Business Owners": "小型商家經營者",
  "Clear guidance for people balancing business, family, and the future.": "給同時兼顧生意、家庭與未來的人清楚指引。",
  "Rural Communities": "鄉村社群",
  "Access to modern knowledge should not depend on where you live.": "能不能接觸現代知識，不該由居住地決定。",
  "Everyday Builders": "努力生活的每一個人",
  "A welcoming place to begin, ask questions, and move forward.": "一個可以安心開始、放心提問、慢慢向前的地方。",
  "Our core products": "核心產品",
  "Learn. Protect. Plan. Grow.": "學習、保護、規劃、成長。",
  "Baby Hippo starts with understanding and protection. Every product makes the next step clearer—not more pressured.": "Baby Hippo 從理解與保護開始。每項產品都要讓下一步更清楚，而不是帶來更多壓力。",
  "Live prototype": "原型已上線",
  "Learning preview": "學習預覽",
  "Phase 1": "第一階段",
  "Understand your risk": "看懂自己的風險",
  "Build a steady plan": "建立穩定計畫",
  "Learn one step at a time": "一步一步學",
  "Monitor market signals and Aave health in calm, plain language—without trading or automatic execution.": "用平靜、白話的方式掌握市場訊號與 Aave 健康度，不交易，也不自動執行。",
  "Learn DCA habits and DeFi lending concepts through simple planning tools and simulations.": "透過簡單的規劃工具與模擬，學習定期定額習慣和 DeFi 借貸觀念。",
  "Short beginner lessons about wallet safety, scams, DCA, lending, and risk management.": "用短篇初學課程認識錢包安全、詐騙、定期定額、借貸與風險管理。",
  "Read-only by design.": "設計上只讀取資料。",
  "Education, not guaranteed outcomes.": "重點是教育，不保證任何結果。",
  "No wallet connection required.": "不需要連接錢包。",
  "Open Lobster Watch": "開啟 Lobster Watch",
  "See the learning path": "查看學習路徑",
  "Your first five-minute lesson": "第一堂五分鐘課程",
  "Understand before you connect.": "連接之前，先弄懂。",
  "A wallet is a tool for accessing on-chain accounts. Never share your seed phrase, never approve something you do not understand, and begin with small, reversible learning steps.": "錢包是存取鏈上帳戶的工具。絕對不要分享助記詞，不要核准自己看不懂的內容，並從小額、可回頭的學習步驟開始。",
  "Protect your seed phrase": "保護助記詞",
  "Check the network": "確認網路",
  "Read before signing": "簽署前先閱讀",
  "Continue learning": "繼續學習",
  "Real people. Real journeys.": "真實的人，真實的旅程。",
  "We will share the learning journeys of drivers, workers, teachers, rural entrepreneurs, and first-time Web3 learners—with dignity and consent.": "我們會在尊重本人意願與尊嚴的前提下，分享司機、勞工、老師、鄉村創業者和 Web3 初學者的學習旅程。",
  "People are the community. The community is more important than hype.": "人就是社群，社群比炒作更重要。",
  "The first Hippo Stories are being gathered with care.": "第一批河馬故事正在用心整理中。",
  "A meaningful story does not need a large portfolio or dramatic success. It begins with honest effort and one lesson worth sharing.": "有意義的故事不需要龐大資產或戲劇化成功。它從誠實的努力，以及一個值得分享的學習開始。",
  "Share your learning journey": "分享你的學習旅程",
  "What we refuse to compromise.": "我們絕不妥協的原則。",
  "Markets change. Technology changes. Our responsibility to ordinary people should remain.": "市場會變，科技會變，但我們對一般人的責任不該改變。",
  "Honest growth, not scams": "誠實成長，不靠詐騙",
  "Long-term progress, not overnight gambling": "長期累積，不賭一夜致富",
  "Education before speculation": "教育先於投機",
  "Risk management before leverage": "風險管理先於槓桿",
  "Tools for ordinary people": "為一般人打造工具",
  "Community over hype": "社群重於炒作",
  "Why we exist": "我們為何存在",
  "The Baby Hippo Manifesto": "Baby Hippo 宣言",
  "Our origin, mission, and the people we are building for.": "我們的起點、使命，以及想服務的人。",
  "Public reading page coming next": "公開閱讀頁面即將推出",
  "How we decide": "我們如何做決定",
  "The Baby Hippo Constitution": "Baby Hippo 憲章",
  "The permanent principles guiding our products and community.": "長期引導產品與社群的核心原則。",
  "Join Baby Hippo": "加入 Baby Hippo",
  "You do not have to know everything to begin.": "不必什麼都懂，才能開始。",
  "Learn at your own pace. Ask questions without shame. Build safer habits. Help someone else when you are ready.": "照自己的步調學習，不必害怕提問，建立更安全的習慣；準備好時，也陪下一個人走一段。",
  "We do not promise wealth. We do not promise easy money.": "我們不承諾財富，也不承諾輕鬆賺錢。",
  "We will keep building for people willing to learn and grow.": "我們會持續為願意學習與成長的人打造。",
  "Explore": "探索",
  "First Lesson": "第一堂課",
  "Safety": "安全",
  "Baby Hippo will never ask for your seed phrase or private key.": "Baby Hippo 絕不會向你索取助記詞或私鑰。",
  "© 2026 Baby Hippo. Built carefully in Taiwan.": "© 2026 Baby Hippo，用心打造於台灣。",
  "Education only. No guaranteed financial outcomes.": "僅供教育用途，不保證任何財務結果。",
  "Founder communication": "創辦人聯絡方式",
  "A real project should be reachable.": "真正的專案，應該找得到人。",
  "Official community channels are being prepared. Until then, use these email addresses for project and founder communication.": "官方社群頻道正在準備中。在此之前，可透過以下信箱聯絡專案或創辦人。",
  "Official Email": "官方信箱",
  "Founder Email": "創辦人信箱",
  "Social Links": "社群連結",
  "Coming Soon": "即將推出",
  "X · Coming Soon": "X・即將推出",
  "Telegram · Coming Soon": "Telegram・即將推出",

  // Community
  "Mission": "使命",
  "Community Values": "社群價值",
  "Who It Is For": "適合誰",
  "Join Us": "加入我們",
  "People are the community": "人就是社群",
  "A place to learn, grow, and help each other.": "一起學習、成長、互相幫助的地方。",
  "Baby Hippo welcomes ordinary people who want to understand Web3, build safer habits, and improve life step by step—without hype, pressure, or shame.": "Baby Hippo 歡迎想了解 Web3、建立更安全習慣，並一步一步改善生活的一般人。這裡沒有炒作、壓力，也不會讓初學者感到羞愧。",
  "Join Telegram": "加入 Telegram",
  "Join X": "追蹤 X",
  "A community built around real life.": "從真實生活出發的社群。",
  "We are here to make on-chain learning feel understandable, safer, and more human for people with jobs, families, students, customers, and responsibilities.": "我們希望讓有工作、家庭、學生、客戶與各種責任的人，也能用更好懂、更安全、更有人味的方式學習鏈上世界。",
  "Honest Growth": "誠實成長",
  "No scams, false promises, hidden pressure, or get-rich-quick culture.": "拒絕詐騙、虛假承諾、暗中施壓與快速致富文化。",
  "Education First": "教育優先",
  "We learn what a tool does, what can go wrong, and what questions to ask before acting.": "行動前，先學會工具怎麼運作、哪裡可能出錯，以及該問哪些問題。",
  "Respect Every Beginner": "尊重每一位初學者",
  "No one should feel ashamed for asking a basic question or starting with limited resources.": "沒有人應該因為問基礎問題，或資源有限而感到丟臉。",
  "Community Over Hype": "社群重於炒作",
  "People, useful knowledge, and safer habits matter more than attention or market noise.": "人、實用知識與安全習慣，比流量和市場雜音更重要。",
  "Drivers & Logistics Workers": "司機與物流工作者",
  "Learning that fits around real shifts, routes, and responsibilities.": "能配合真實班表、路線與責任的學習方式。",
  "Labor & Everyday Workers": "勞工與一般工作者",
  "A practical place to understand modern tools without insider language.": "不用圈內術語，也能實際理解現代工具的地方。",
  "Music & Arts Teachers": "音樂與藝術老師",
  "A community that values patience, practice, and grassroots education.": "珍惜耐心、練習與基層教育的社群。",
  "Clear learning for people balancing customers, family, and the future.": "給同時照顧客人、家庭與未來的人清楚學習內容。",
  "People From Rural Areas": "來自鄉村地區的人",
  "Knowledge and opportunity should not depend on a big-city address.": "知識與機會不該只屬於住在大城市的人。",
  "First-Time Web3 Learners": "第一次接觸 Web3 的人",
  "A calm place to begin, ask questions, and build confidence step by step.": "可以平靜開始、放心提問，一步一步建立信心的地方。",
  "Follow on X": "追蹤 X",
  "Learn together": "一起學習",
  "Grow one responsible step at a time": "一次踏出一個負責任的步伐",
  "Our mission": "我們的使命",
  "Help ordinary people become more capable on-chain.": "幫助一般人在鏈上世界變得更有能力。",
  "Our mission is to make wallets, DCA, DeFi lending, and risk management easier to understand for people with real jobs, families, students, and responsibilities.": "我們的使命，是讓有工作、家庭、學生與各種責任的人，也能更容易理解錢包、定期定額、DeFi 借貸與風險管理。",
  "Becoming an on-chain boss does not mean becoming rich overnight. It means learning how the tools work, recognizing risk, making independent decisions, and helping someone else when you are ready.": "成為鏈上老闆，不是指一夜致富；而是學會工具如何運作、辨識風險、獨立做決定，並在準備好時幫助下一個人。",
  "We do not promise easy money. We promise to keep building education, practical tools, and a respectful place to begin.": "我們不承諾輕鬆賺錢；我們承諾持續打造教育、實用工具，以及一個尊重每個起點的地方。",
  "How we treat each other matters.": "我們如何對待彼此，很重要。",
  "These principles guide conversations, learning, moderation, and everything we build together.": "這些原則會引導社群對話、學習、管理，以及我們共同打造的每一件事。",
  "In this community, we:": "在這個社群裡，我們會：",
  "Ask questions without shame": "放心提問，不必感到羞愧",
  "Explain risk before opportunity": "先說清楚風險，再談機會",
  "Correct mistakes respectfully": "用尊重的方式修正錯誤",
  "Protect beginners from scams": "保護初學者遠離詐騙",
  "Who this community is for": "這個社群適合誰",
  "If you work hard and want to learn, you belong here.": "只要你認真生活、願意學習，這裡就有你的位置。",
  "You do not need a large portfolio, technical background, or online following.": "你不需要龐大資產、技術背景，也不需要很多網路粉絲。",
  "Choose your starting point": "選擇你的起點",
  "Come learn with Baby Hippo.": "來和 Baby Hippo 一起學習。",
  "Join the conversation on Telegram or follow the project's learning notes and updates on X. Participation does not require a wallet connection or financial information.": "加入 Telegram 對話，或在 X 追蹤專案的學習筆記與進度。參與不需要連接錢包，也不需要提供財務資料。",
  "Join the conversation on Telegram or follow the project’s learning notes and updates on X. Participation does not require a wallet connection or financial information.": "加入 Telegram 對話，或在 X 追蹤專案的學習筆記與進度。參與不需要連接錢包，也不需要提供財務資料。",
  "Conversation & questions": "交流與提問",
  "Meet other learners, ask beginner questions, and receive community updates.": "認識其他學習者、提出初學問題，也接收社群近況。",
  "Learning notes & progress": "學習筆記與進度",
  "Baby Hippo on X": "Baby Hippo 的 X",
  "Follow founder notes, product updates, safety reminders, and learning posts.": "追蹤創辦人筆記、產品進度、安全提醒與學習內容。",
  "Verify official links from this page. Community moderators will never request passwords, seed phrases, private keys, or payment to answer a question.": "請從本頁確認官方連結。社群管理員絕不會索取密碼、助記詞、私鑰，也不會要求付費才回答問題。",
  "Education first. Risk management first. No guaranteed financial outcomes.": "教育優先，風險管理優先，不保證任何財務結果。",

  // Learn
  "Beginner Learning Hub": "初學者學習中心",
  "Lessons": "課程",
  "Learning Path": "學習路徑",
  "Begin with Bitcoin": "從比特幣開始",
  "View learning path": "查看學習路徑",
  "Hippo Academy · Beginner path": "河馬學院・初學路徑",
  "Learn the basics. Protect your future.": "學好基礎，保護自己的未來。",
  "Understand first, then act. Build knowledge one step at a time.": "先理解，再行動。一步一步建立鏈上知識。",
  "Seven short lessons explain the ideas behind Bitcoin, Ethereum, DeFi, and wallet safety in everyday language. No wallet connection. No pressure to buy anything.": "七堂短課用生活化語言說明比特幣、以太坊、DeFi 與錢包安全。不連接錢包，也不催促你購買任何東西。",
  "Education only. Every lesson includes a beginner warning.": "僅供教育用途，每堂課都有初學者提醒。",
  "Knowledge compounds": "知識也會複利",
  "One clear lesson at a time": "一次學清楚一件事",
  "Your learning road": "你的學習路線",
  "Seven stops. One safer foundation.": "七個站點，打好更安全的基礎。",
  "Read in order or begin with the question you have today.": "你可以依序閱讀，也可以從今天最想了解的問題開始。",
  "Beginner lessons": "初學者課程",
  "Lesson": "課程",
  "Risk Management": "風險管理",
  "Seed Phrase": "助記詞",
  "Plain language, practical warnings.": "白話說明，實際提醒。",
  "These explanations are a starting point—not financial advice or a substitute for checking current documentation before using a protocol.": "這些說明只是起點，不構成財務建議；使用任何協議前，仍應查閱最新官方文件。",
  "What is Bitcoin?": "什麼是比特幣？",
  "What is Ethereum?": "什麼是以太坊？",
  "What is DCA?": "什麼是定期定額？",
  "What is Aave?": "什麼是 Aave？",
  "What is Ether.fi?": "什麼是 Ether.fi？",
  "What is Risk Management?": "什麼是風險管理？",
  "What is a Seed Phrase?": "什麼是助記詞？",
  "Bitcoin is a digital asset and payment network that can move value without a bank controlling the ledger. Its transaction history is recorded by a distributed network of computers.": "比特幣是一種數位資產與支付網路，不需要由銀行控制帳本也能轉移價值。交易紀錄由分散在各地的電腦共同保存。",
  "Bitcoin introduced the idea that people can hold and transfer a scarce digital asset using an open network. It is often the first concept people meet when learning about crypto.": "比特幣讓人們看見，可以透過開放網路持有與轉移稀缺的數位資產。它通常也是多數人接觸加密世界的第一個概念。",
  "Bitcoin’s price can change sharply. Sending it to the wrong address or network may be irreversible. Learning about it does not mean you need to buy it.": "比特幣價格可能劇烈波動，轉到錯誤地址或網路也可能無法挽回。了解它，不代表你一定要購買。",
  "Ethereum is a public blockchain that can run programmable applications called smart contracts. People use it for payments, digital ownership, lending, exchanges, and many other on-chain tools.": "以太坊是一條可執行智慧合約的公開區塊鏈。人們用它處理支付、數位所有權、借貸、交換與其他鏈上工具。",
  "Ethereum makes it possible for applications like Aave and Ether.fi to operate without a traditional company manually approving every action.": "以太坊讓 Aave、Ether.fi 這類應用能運作，不需要傳統公司逐筆人工核准。",
  "Smart contracts can contain bugs, applications can be misleading, and network fees can vary. Always confirm the website, network, and transaction details.": "智慧合約可能有漏洞，應用也可能誤導使用者，網路費用則會變動。請務必確認網站、網路與交易細節。",
  "Dollar-cost averaging, or DCA, means dividing a planned amount into smaller purchases made on a regular schedule instead of trying to choose one perfect moment.": "定期定額（DCA）是把預計投入的金額拆成較小份，按照固定時間執行，而不是試著猜中唯一的完美時機。",
  "A schedule can reduce emotional decisions and make a plan easier to follow. It can be useful for people who prefer steady habits over constant chart watching.": "固定節奏能減少情緒化決定，也讓計畫比較容易遵守，適合重視穩定習慣、不想一直盯盤的人。",
  "DCA does not guarantee profit and does not make a risky asset safe. Only use money your real-life budget can handle, and review the plan regularly.": "定期定額不保證獲利，也不會讓高風險資產變安全。只能使用生活預算承受得起的金額，並定期檢視計畫。",
  "Aave is a decentralized lending protocol. Users can supply supported assets to earn variable interest, or borrow assets by providing enough collateral.": "Aave 是去中心化借貸協議。使用者可以提供支援的資產取得浮動利息，也能在提供足夠抵押品後借入資產。",
  "Aave is a practical example of DeFi lending. Learning it helps explain collateral, interest rates, Health Factor, and liquidation risk.": "Aave 是理解 DeFi 借貸的實際案例，可以幫助初學者認識抵押品、利率、健康度與清算風險。",
  "Borrowing can lead to liquidation if collateral value falls or debt grows. Rates change, smart-contract risk exists, and supplied assets are not the same as a bank deposit.": "抵押品下跌或債務增加時，借款可能遭到清算。利率會變，智慧合約也有風險，而且提供資產不等同銀行存款。",
  "Ether.fi is a staking and restaking protocol built around Ethereum. It offers liquid receipt assets, including eETH and weETH, that represent a user’s position in the protocol.": "Ether.fi 是以以太坊為核心的質押與再質押協議，提供 eETH、weETH 等流動性憑證資產，代表使用者在協議中的部位。",
  "It shows how one on-chain asset can represent another position and continue moving through DeFi. Understanding this helps beginners recognize layered protocols and additional risk.": "它示範鏈上資產如何代表另一個部位，並繼續在 DeFi 中使用。了解這點，有助初學者看懂協議層次與額外風險。",
  "Restaking adds complexity. Risks may include smart contracts, validators, changing exchange rates, liquidity, integrations, and the protocols underneath the position.": "再質押會增加複雜度，風險可能來自智慧合約、驗證者、兌換率變動、流動性、整合服務與底層協議。",
  "Risk management means deciding what could go wrong before taking action, limiting how much one mistake can hurt, and keeping enough flexibility to respond.": "風險管理，是在行動前先想清楚哪裡可能出錯，限制單一錯誤造成的傷害，並保留足夠彈性來應對。",
  "On-chain actions can be fast and irreversible. Good habits—small test amounts, diversification, Health Factor monitoring, and careful approvals—can reduce preventable harm.": "鏈上操作快速且可能無法撤回。小額測試、分散風險、監控健康度與謹慎核准，都能降低可避免的傷害。",
  "No checklist removes every risk. Avoid leverage you do not understand, promises of unusually high returns, urgent messages, and positions too large for your real-life finances.": "沒有任何清單能消除全部風險。請避開不理解的槓桿、異常高報酬承諾、催促訊息，以及超出生活財務承受力的部位。",
  "A seed phrase is a set of recovery words that can recreate access to a crypto wallet. Anyone who has the complete phrase can usually control the wallet and its assets.": "助記詞是一組可恢復加密錢包存取權的單字。任何拿到完整助記詞的人，通常都能控制錢包與其中資產。",
  "It is the master backup for many self-custody wallets. Protecting it is more important than protecting a username or ordinary password.": "它是許多自託管錢包最重要的備份，保護助記詞比保護一般帳號密碼更重要。",
  "Never type it into a website, send it in a message, save it in cloud notes, or share it with support staff. Baby Hippo and legitimate moderators will never ask for it.": "絕對不要把助記詞輸入網站、透過訊息傳送、存進雲端筆記，或交給客服。Baby Hippo 與真正的管理員永遠不會索取它。",
  "Simple explanation": "簡單說明",
  "Why it matters": "為什麼重要",
  "Beginner warning": "初學者提醒",
  "Lesson complete": "完成本課",
  "Read slowly. Verify before acting.": "慢慢讀，行動前先確認。",
  "Next: Understand Ethereum": "下一步：認識以太坊",
  "Next: Learn the DCA habit": "下一步：學習定期定額習慣",
  "Next: See how Aave works": "下一步：了解 Aave 如何運作",
  "Next: Understand Ether.fi": "下一步：認識 Ether.fi",
  "Next: Build a risk mindset": "下一步：建立風險思維",
  "Next: Protect your seed phrase": "下一步：保護助記詞",
  "Continue with the community": "前往社群繼續學習",
  "You now have a stronger starting point.": "你已經有更穩固的起點。",
  "Your next responsible step": "下一個負責任的步驟",
  "Keep learning before you add complexity.": "增加複雜度之前，先繼續學習。",
  "Ask questions, revisit the warnings, and use read-only tools before considering any irreversible on-chain action.": "多提問、重讀風險提醒，並先使用只讀工具，再考慮任何無法撤回的鏈上操作。",
  "Join the learning community": "加入學習社群",
  "Explore Lobster Watch": "探索 Lobster Watch",

  // DCA planner
  "Educational DCA Planner": "定期定額學習規劃器",
  "Calculator": "計算器",
  "Projection": "試算",
  "Assumptions": "假設條件",
  "Build a plan": "建立計畫",
  "Hippo Bank · Educational planner": "河馬銀行・教育規劃器",
  "Build a calmer monthly DCA plan.": "建立一份更安心的每月定期定額計畫。",
  "Start with real-life needs, then plan for the long term.": "先看生活預算，再規劃長期投入。",
  "Explore how monthly surplus and a simple allocation mix could look over time. Nothing is saved, connected, purchased, or executed.": "看看每月結餘與簡單配置，長期可能呈現什麼樣子。這裡不儲存資料、不連接錢包、不購買，也不執行任何交易。",
  "Educational illustration only. This is not financial advice.": "僅為教育試算，不構成財務建議。",
  "Plan before action": "行動前先規劃",
  "Your real-life budget comes first": "先照顧真實生活的預算",
  "Your monthly picture": "你的每月收支",
  "Start with your budget.": "先從預算開始。",
  "Reset": "重設",
  "Monthly income": "每月收入",
  "Use take-home income in USD for this illustration.": "本試算請輸入美元計價的每月實領收入。",
  "Monthly expenses": "每月支出",
  "Include housing, food, transport, debt, family needs, and savings priorities.": "請納入居住、飲食、交通、債務、家庭需求與優先儲蓄。",
  "Illustrative risk level": "示意風險偏好",
  "Cautious": "保守",
  "Balanced": "均衡",
  "Growth": "成長",
  "More weight on the simpler asset mix, with a smaller DeFi learning bucket.": "較著重簡單資產配置，並保留較小的 DeFi 學習比例。",
  "A middle educational mix across Bitcoin, Ethereum, and yield concepts.": "在比特幣、以太坊與收益概念之間採取中間型的學習配置。",
  "More Ethereum exposure while keeping the yield learning bucket limited.": "提高以太坊比例，同時限制收益學習部位。",
  "“Available” means income minus entered expenses. It does not confirm that the full amount is safe to invest. Emergency savings and near-term needs come first.": "「可運用金額」只是收入減去輸入的支出，不代表整筆都適合投入。請先準備緊急預備金並照顧近期需求。",
  "Monthly available amount": "每月可運用金額",
  "Suggested BTC allocation": "BTC 示意配置",
  "Suggested ETH allocation": "ETH 示意配置",
  "Suggested Yield allocation": "收益學習示意配置",
  "Illustrative monthly mix": "每月示意配置",
  "Bitcoin": "比特幣",
  "Ethereum": "以太坊",
  "Yield learning": "收益學習",
  "mix": "配置",
  "Long-term illustration": "長期試算",
  "See the habit, not a promise.": "看見習慣，不是承諾。",
  "The chart compares your total contributions with a fixed 5% annual growth example. Real BTC, ETH, and DeFi results can be much lower, negative, or highly uneven.": "圖表比較累計投入金額與固定年成長 5% 的示意結果。真實的 BTC、ETH 與 DeFi 結果可能低很多、出現虧損，或非常不平均。",
  "Projection chart": "試算圖表",
  "Monthly contributions, compounded monthly": "每月投入，按月複利試算",
  "5% example": "5% 示意",
  "Illustrative 5% example": "5% 示意結果",
  "Contributions only": "僅累計投入",
  "Read before using the numbers": "使用數字前請先閱讀",
  "Assumptions and limits": "假設與限制",
  "The calculator uses USD and assumes the same contribution every month.": "計算器使用美元，並假設每月投入相同金額。",
  "The 5% rate is a fixed educational example, not a market forecast.": "5% 是固定的教育示例，不是市場預測。",
  "Taxes, fees, inflation, price volatility, protocol losses, and changing yield rates are excluded.": "未納入稅務、費用、通膨、價格波動、協議損失與收益率變動。",
  "“Yield” is an educational category, not a recommendation for any protocol.": "「收益」只是教育分類，不代表推薦任何協議。",
  "The allocation mix is a learning prompt—not a personalized investment recommendation.": "配置只是學習提示，不是個人化投資建議。",
  "Learn the concepts first": "先學懂觀念",
  "Expenses meet or exceed income": "支出等於或高於收入",
  "% of available amount": "% 可運用金額",
  "% of entered income": "% 輸入收入",
  "% learning bucket": "% 學習配置",
  "Contributed:": "累計投入：",
  "Illustrative difference:": "示意差額：",
  "year": "年",
  "years": "年",

  // Earn
  "Earn & Learn": "收益學習",
  "Protocols": "協議",
  "Compare": "比較",
  "Safety first": "安全優先",
  "Start exploring": "開始探索",
  "Hippo Academy · DeFi foundations": "河馬學院・DeFi 基礎",
  "Understand yield before chasing it.": "追求收益前，先把它弄懂。",
  "Learn what four DeFi protocols do, what may be useful, and what can go wrong—without connecting a wallet or moving any money.": "了解四個 DeFi 協議在做什麼、可能有什麼用途，以及哪裡可能出錯；不用連接錢包，也不用移動任何資金。",
  "Explore the protocols": "認識這些協議",
  "Learn DeFi basics first": "先學 DeFi 基礎",
  "Educational only. No live rates, recommendations, wallet connection, or transactions.": "僅供教育用途，不提供即時利率、推薦、錢包連接或交易。",
  "before you earn": "先於收益",
  "Risk comes first": "風險優先",
  "No yield is guaranteed": "沒有任何收益受到保證",
  "Understand the source": "了解收益來源",
  "Know how value is generated.": "弄懂價值如何產生。",
  "Count every layer": "看清每一層",
  "Each dependency adds risk.": "每一個依賴都會增加風險。",
  "Protect the downside": "先保護下行風險",
  "Rates never remove principal risk.": "利率再高，也不會消除本金風險。",
  "Four protocols, four lessons": "四個協議，四堂課",
  "Learn the product and the risk together.": "產品與風險要一起學。",
  "These summaries describe broad concepts, not current returns or personalized choices. Protocol rules, assets, and networks can change.": "以下內容說明整體概念，不代表目前收益或個人化選擇。協議規則、資產與網路都可能改變。",
  "What it is": "它是什麼",
  "Potential benefits": "可能的好處",
  "Important risks": "重要風險",
  "Beginner suitability": "初學者適合度",
  "Intermediate": "中階",
  "Advanced": "進階",
  "Official resources": "官方資料",
  "Liquid staking and restaking": "流動性質押與再質押",
  "Decentralized lending": "去中心化借貸",
  "Capital-efficient lending": "資金效率型借貸",
  "Lending, liquidity, and vaults": "借貸、流動性與金庫",
  "Ethereum ecosystem": "以太坊生態系",
  "Multiple blockchain networks": "多條區塊鏈網路",
  "Hyperliquid ecosystem": "Hyperliquid 生態系",
  "Quick comparison": "快速比較",
  "Choose what to learn next—not what to buy.": "選擇下一步學什麼，而不是買什麼。",
  "Protocol": "協議",
  "Main lesson": "主要學習重點",
  "Network": "網路",
  "Starting level": "入門程度",
  "Baby Hippo safety rule": "Baby Hippo 安全原則",
  "Yield is payment for taking risk.": "收益是承擔風險的補償。",
  "A displayed rate is not a promise. It can fall, and the underlying asset can lose value. Smart contracts, networks, oracles, liquidity, collateral, and token issuers can fail independently or together.": "畫面上的利率不是承諾；它可能下降，底層資產也可能貶值。智慧合約、網路、預言機、流動性、抵押品與代幣發行方，都可能單獨或同時出問題。",
  "Learn the source of yield": "了解收益來源",
  "Read the withdrawal rules": "讀懂提領規則",
  "Understand liquidation before borrowing": "借款前先弄懂清算",
  "Never treat a DeFi position like insured savings": "不要把 DeFi 部位當成受保障的存款",
  "Continue in Hippo Academy": "前往河馬學院繼續學習",
  "Ether.fi is a protocol for staking ETH and receiving a liquid token that represents the position. Its products can also add restaking and other protocol layers, so one asset may depend on several systems working correctly.": "Ether.fi 讓使用者質押 ETH，並取得代表該部位的流動性代幣。產品也可能加入再質押與其他協議層，因此一項資產可能同時依賴多個系統正常運作。",
  "Helps learners understand Ethereum staking without locking every use of the position.": "幫助學習者理解以太坊質押，同時保留部位在其他地方使用的可能性。",
  "Liquid receipt assets may be usable in other compatible DeFi applications.": "流動性憑證資產可能可用於其他相容的 DeFi 應用。",
  "Makes staking rewards and composable on-chain assets easier to study.": "有助於學習質押獎勵與可組合的鏈上資產。",
  "Smart-contract, validator, liquidity, and changing exchange-rate risk.": "包含智慧合約、驗證者、流動性與兌換率變動風險。",
  "Restaking and integrations add dependencies beyond ordinary ETH staking.": "再質押與外部整合，會在一般 ETH 質押之外增加更多依賴。",
  "A receipt token is not the same as holding native ETH in a wallet.": "持有憑證代幣，不等同於在錢包中持有原生 ETH。",
  "Better after learning Ethereum, staking, liquid tokens, and smart-contract risk.": "較適合先學過以太坊、質押、流動性代幣與智慧合約風險的人。",
  "Study the token layers before considering any action.": "採取任何行動前，先弄懂每一層代幣代表什麼。",
  "Aave is a non-custodial liquidity protocol. Suppliers provide supported assets to a market and may receive variable interest. Borrowers provide collateral, take debt, and must manage liquidation risk.": "Aave 是非託管流動性協議。提供者把支援的資產放入市場，可能取得浮動利息；借款人則提供抵押品、承擔債務，也必須管理清算風險。",
  "A practical place to learn supply, borrow, collateral, and variable-rate concepts.": "是學習提供、借款、抵押品與浮動利率概念的實際案例。",
  "On-chain positions and market rules are publicly observable.": "鏈上部位與市場規則可公開查驗。",
  "Health Factor gives borrowers a visible measure of liquidation safety.": "健康度讓借款人能看見部位距離清算風險有多遠。",
  "Interest and incentive rates can change at any time.": "利息與獎勵率都可能隨時改變。",
  "Borrowers can be liquidated when collateral no longer safely covers debt.": "抵押品無法安全支撐債務時，借款人可能遭到清算。",
  "Smart contracts, oracles, networks, and supplied assets can each fail or lose value.": "智慧合約、預言機、網路與提供的資產，都可能個別失效或貶值。",
  "Supplying is easier to understand than borrowing. Borrowing is not beginner-level.": "提供資產比借款容易理解；借款不是初學者等級的操作。",
  "Learn Health Factor before learning leverage.": "接觸槓桿前，先學會看健康度。",
  "HyperLend is a lending protocol designed for the Hyperliquid ecosystem. Its documentation emphasizes capital efficiency, dynamic rates, liquidity access, and features aimed at active traders and sophisticated market participants.": "HyperLend 是為 Hyperliquid 生態系設計的借貸協議，官方文件著重資金效率、動態利率、流動性取得，以及面向活躍交易者與進階市場參與者的功能。",
  "Introduces how lending infrastructure can serve a fast trading ecosystem.": "可用來了解借貸基礎設施如何服務快速交易生態系。",
  "Dynamic markets can help learners study utilization and changing rates.": "動態市場有助於學習資金使用率與利率變化。",
  "Shows more advanced uses of collateral and on-chain liquidity.": "展示抵押品與鏈上流動性的進階用途。",
  "Advanced features and leverage can magnify losses and liquidation risk.": "進階功能與槓桿會放大損失與清算風險。",
  "A newer ecosystem may have less history and different infrastructure risks.": "較新的生態系歷史較短，也可能有不同的基礎設施風險。",
  "Dynamic rates, oracle behavior, liquidity, and smart contracts require monitoring.": "動態利率、預言機行為、流動性與智慧合約都需要持續注意。",
  "Not beginner-first. Best treated as advanced study after lending and liquidation basics.": "不是以初學者為主。較適合先學會借貸與清算基礎後，再當作進階內容研究。",
  "Observe and learn before interacting with complex credit tools.": "接觸複雜信用工具前，先觀察並學習。",
  "Kamino is a Solana DeFi protocol with lending markets and managed vault structures. It can help learners compare direct lending with products that route assets according to a strategy.": "Kamino 是 Solana 上的 DeFi 協議，包含借貸市場與管理型金庫架構，可幫助學習者比較直接借貸，以及依照策略調度資產的產品。",
  "Combines several useful DeFi learning topics in one ecosystem.": "在同一生態系中結合多個實用的 DeFi 學習主題。",
  "Shows how lending reserves, vault shares, and allocation strategies work.": "展示借貸儲備、金庫份額與配置策略如何運作。",
  "Provides visible risk materials for studying market structure.": "提供可查閱的風險資料，方便研究市場結構。",
  "Vault strategies can add management, allocation, and dependency risk.": "金庫策略可能增加管理、配置與外部依賴風險。",
  "Borrowing still carries collateral and liquidation risk.": "借款仍然伴隨抵押品與清算風險。",
  "Solana, smart contracts, oracles, tokens, and liquidity all add separate risks.": "Solana、智慧合約、預言機、代幣與流動性，各自都會帶來風險。",
  "Intermediate. Learn Solana wallets, lending, vault shares, and liquidation first.": "中階。請先學會 Solana 錢包、借貸、金庫份額與清算。",
  "Understand what a vault holds and who controls its strategy.": "先弄懂金庫持有什麼，以及誰控制它的策略。",

  // Story
  "Founder Story": "創辦人故事",
  "Journey": "旅程",
  "Founder Lessons": "創辦人心得",
  "Mistakes Made": "走過的彎路",
  "Mistakes": "走過的彎路",
  "Why Baby Hippo": "為什麼創立 Baby Hippo",
  "Read the journey": "閱讀這段旅程",
  "From Miaoli to the on-chain world": "從苗栗走進鏈上世界",
  "I did not start as a crypto expert.": "我不是從加密貨幣專家開始的。",
  "I came here slowly through work, teaching, and lesson after lesson.": "我從工作、教學與一次次學習中慢慢走來。",
  "Learning": "學習",
  "I came from a rural town, worked in logistics and freight transportation, and taught violin. Baby Hippo is the story of learning financial tools slowly—and building something useful for people whose lives look like mine.": "我來自鄉間，做過物流與貨運，也教過小提琴。Baby Hippo 的故事，是慢慢學會金融工具，再為和我有相似生活的人打造實用東西。",
  "Follow the journey": "沿著這段旅程往下看",
  "This is a learning story, not a claim of financial success or a promise of results.": "這是一段學習故事，不是財務成功宣言，也不承諾任何結果。",
  "Work · Music · Learning": "工作・音樂・學習",
  "Practice builds progress": "練習帶來進步",
  "On the road, in music, and in life": "在路上、音樂裡，也在人生中",
  "An ordinary beginning": "一個平凡的起點",
  "Two jobs shaped one idea.": "兩份工作，慢慢長出一個想法。",
  "Freight work taught me that responsibility is practical. You prepare, check the route, protect the load, and keep going when the day changes unexpectedly.": "貨運工作讓我明白，責任不是口號。要先準備、確認路線、保護貨物，也要在行程突然改變時繼續處理好每件事。",
  "Violin teaching taught me that growth is patient. A difficult passage becomes possible through small corrections repeated over time—not through one heroic practice session.": "小提琴教學讓我知道，成長需要耐心。困難的樂句，是靠長期反覆修正變得可行，不是靠一次拼命練習。",
  "“Baby Hippo combines those lessons: carry risk carefully, practice consistently, and never make a beginner feel small.”": "「Baby Hippo 把這些經驗放在一起：小心承擔風險、持續練習，也絕不讓初學者覺得自己很渺小。」",
  "The founder timeline": "創辦人時間線",
  "One road, eight honest chapters.": "同一條路，八個誠實篇章。",
  "This is not a straight line from struggle to wealth. It is a continuing path from work, to questions, to better habits, to building in public.": "這不是一條從辛苦直接通往財富的直線，而是從工作、提問、更好的習慣，一路走到公開打造產品的持續旅程。",
  "Roots": "根",
  "Work": "工作",
  "Teaching": "教學",
  "Discipline": "紀律",
  "DeFi": "DeFi",
  "Risk": "風險",
  "Building": "打造",
  "Growing up in rural Miaoli": "在苗栗鄉間長大",
  "Learning responsibility on the road": "在道路上學會責任",
  "Teaching violin, one practice at a time": "教小提琴，也一次練好一小段",
  "Starting to understand investing": "開始理解投資",
  "Building a DCA habit": "建立定期定額習慣",
  "Exploring Ether.fi": "探索 Ether.fi",
  "Learning Aave and Health Factor": "學習 Aave 與健康度",
  "Creating Baby Hippo": "創立 Baby Hippo",
  "Life began far from financial centers and technology companies. That background taught me to value practical knowledge, honest work, and opportunities that reach beyond big cities.": "我的生活起點離金融中心和科技公司很遠。這樣的背景，讓我珍惜實用知識、誠實工作，以及不只屬於大城市的機會。",
  "Logistics and freight work meant long hours, changing schedules, and responsibility for every load. It showed me why working people need tools that respect limited time and real-life pressure.": "物流與貨運代表長工時、變動的行程，以及對每一批貨物負責。它讓我明白，工作者需要真正尊重有限時間與生活壓力的工具。",
  "Violin teaching taught me that progress is rarely dramatic. Students improve through patient repetition, honest feedback, and small habits—the same mindset I later brought to financial learning.": "小提琴教學讓我知道，進步很少是戲劇性的。學生靠耐心重複、誠實回饋與小習慣慢慢成長；後來我也用同樣心態學習金融。",
  "I began as a learner, not an expert. I had to work through unfamiliar language, market noise, fear, and the temptation to move faster than my understanding.": "我從學習者開始，不是專家。我必須慢慢穿過陌生術語、市場雜音、恐懼，以及還沒理解就想加快腳步的誘惑。",
  "DCA helped shift my attention away from guessing the perfect moment. The deeper lesson was not about a guaranteed result—it was about budgeting, consistency, and making fewer emotional decisions.": "定期定額讓我不再一直猜完美時機。更深的課題不是保證結果，而是預算、持續性，以及減少情緒化決定。",
  "Ether.fi introduced me to staking, liquid receipt tokens, and restaking. It also taught me that every extra layer can add another dependency and another question that must be understood.": "Ether.fi 讓我接觸質押、流動性憑證代幣與再質押，也讓我明白，每增加一層，就可能多一項依賴與一個必須弄懂的問題。",
  "Aave made collateral, borrowing, changing rates, and liquidation risk real. Health Factor became a reminder that protecting a position matters more than chasing the maximum possible return.": "Aave 讓抵押品、借款、利率變動與清算風險變得具體。健康度提醒我，保護部位比追求最高可能收益更重要。",
  "Baby Hippo grew from one question: what would on-chain education and risk tools look like if they were designed for drivers, teachers, workers, and first-time learners instead of insiders?": "Baby Hippo 從一個問題長出來：如果鏈上教育與風險工具，是為司機、老師、勞工與初學者，而不是圈內人設計，會是什麼樣子？",
  "Founder lessons": "創辦人心得",
  "What the road has taught me.": "這條路教會我的事。",
  "Slow is still progress": "慢，也是一種進步",
  "Understanding comes first": "先理解，再行動",
  "Risk is part of the product": "風險本來就是產品的一部分",
  "People need dignity, not pressure": "人需要的是尊重，不是壓力",
  "A calm plan that survives real life is more valuable than a complicated plan that cannot be followed.": "一份能通過真實生活考驗的平穩計畫，比無法遵守的複雜計畫更有價值。",
  "If I cannot explain a product simply, I am not ready to depend on it.": "如果我無法簡單說明一項產品，就還沒準備好依賴它。",
  "Yield, collateral, liquidity, smart contracts, and token layers must be studied together.": "收益、抵押品、流動性、智慧合約與代幣層次，必須放在一起理解。",
  "Beginners deserve plain language and room to ask basic questions without being sold a dream.": "初學者值得白話說明，也應該有空間提出基礎問題，而不是被兜售夢想。",
  "Mistakes made": "走過的彎路",
  "Learning also means admitting what went wrong.": "學習，也包括承認自己哪裡做錯了。",
  "No one becomes safer by hiding confusion.": "把困惑藏起來，不會讓任何人更安全。",
  "Trying to learn everything at once": "想一次學會所有東西",
  "Watching prices more than the plan": "看價格多過看計畫",
  "Seeing a rate before seeing its risks": "先看到利率，卻晚一點才看到風險",
  "Underestimating DeFi complexity": "低估 DeFi 的複雜度",
  "Web3 has endless protocols and terminology. Moving too quickly created more confusion, not more confidence.": "Web3 有數不完的協議與術語。走得太快帶來的是更多困惑，不是更多信心。",
  "Now I learn one system and one risk at a time.": "現在，我一次只學一個系統與一項風險。",
  "Short-term movement can make a sensible routine feel wrong and an impulsive decision feel urgent.": "短期波動會讓合理習慣看起來像錯的，也讓衝動決定顯得很急迫。",
  "Now the budget, time horizon, and risk limit come before the chart.": "現在，我先看預算、時間範圍與風險上限，再看圖表。",
  "A displayed yield is easy to notice. The asset, contract, liquidity, network, and withdrawal risks take more work.": "畫面上的收益率很容易看到，但資產、合約、流動性、網路與提領風險，需要花更多力氣理解。",
  "Now I ask where the yield comes from and what can break.": "現在，我會先問收益從哪裡來，以及哪些地方可能出問題。",
  "Staking tokens, collateral, borrowing, and integrations can stack several risks into one position.": "質押代幣、抵押品、借款與外部整合，可能把多種風險疊進同一個部位。",
  "Now simplicity is a safety feature, not a lack of ambition.": "現在，簡單對我來說是安全設計，不是缺少企圖。",
  "Why Baby Hippo exists": "Baby Hippo 為什麼存在",
  "Financial tools should not belong only to whales.": "金融工具不該只屬於巨鯨。",
  "Drivers, logistics workers, teachers, artists, small business owners, rural communities, and ordinary families deserve education and risk tools too. They deserve explanations that respect their intelligence without assuming they already speak the language of finance or Web3.": "司機、物流工作者、老師、藝術工作者、小型商家、鄉村社群與一般家庭，也值得擁有教育與風險工具。他們值得被尊重地說明，而不是被假設早就懂金融或 Web3 術語。",
  "“I do not promise wealth or easy money. I promise to keep building tools, education, and opportunities for people willing to learn and grow.”": "「我不承諾財富，也不承諾輕鬆賺錢。我承諾持續為願意學習與成長的人打造工具、教育與機會。」",
  "Long-term habits before shortcuts": "長期習慣先於捷徑",
  "Community before token price": "社群先於代幣價格",
  "Meet the community": "認識這個社群",
  "Visit Hippo Academy": "前往河馬學院",
  "An honest founder story. No financial promises. No hype.": "一段誠實的創辦人故事，不承諾財富，也不炒作。",
  "From Worker To On-Chain Boss.": "從上班族，成為鏈上老闆。",
};

const lobsterZh: Record<string, string> = {
  "Return to Baby Hippo": "返回 Baby Hippo",
  "Return Home": "返回首頁",
  "Return to Baby Hippo homepage": "返回 Baby Hippo 首頁",
  "by Baby Hippo": "Baby Hippo 出品",
  "Dashboard": "儀表板",
  "Portfolio": "資產概況",
  "Active Debt": "借款狀態",
  "Refresh Data": "更新資料",
  "No Active Debt": "目前無借款",
  "Alerts": "提醒事項",
  "Aave": "借貸監控",
  "Aave Monitor": "借貸監控",
  "DCA": "我的定投",
  "DCA Planner": "我的定投",
  "Settings": "設定",
  "Reminder": "提醒事項",
  "Language & Time": "語言與時間",
  "All systems calm": "系統運作正常",
  "Mock data · updated now": "示範資料・剛剛更新",
  "CoinGecko · updated": "CoinGecko・更新於",
  "Read-only prototype": "唯讀測試版",
  "Today · Asia/Taipei": "今天・台北時間",
  "Welcome back, Boss.": "老闆，歡迎回來。",
  "Keep learning, stay disciplined, and let Lobster Watch handle the quiet checks.": "持續學習、保持紀律，讓 Lobster Watch 安靜替你留意重要變化。",
  "Add price alert": "新增價格提醒",
  "A note from Baby Hippo": "Baby Hippo 想對你說",
  "Built for real life.": "為真實生活而打造。",
  "Built for truck drivers, teachers, workers and ordinary people who want a better future.": "為卡車司機、老師、勞動工作者，以及每一位想讓未來更好的人而打造。",
  "Education first": "教育優先",
  "Risk before leverage": "風險先於槓桿",
  "Grow step by step": "一步一步成長",
  "Aave warning": "借貸警示",
  "Your Base Health Factor is below 2.00.": "你的 Base 健康係數低於 2.00。",
  "Review Aave": "查看借貸監控",
  "Community progress": "社群進度",
  "Small, responsible steps are how a community grows.": "社群靠每一個穩健、負責任的小步驟成長。",
  "Community Members": "社群成員",
  "Learning together": "一起學習",
  "Learning Tasks Completed": "已完成學習任務",
  "Knowledge compounds": "知識也會複利",
  "DCA Plans Created": "已建立定投計畫",
  "Discipline in practice": "把紀律化為行動",
  "BTC Status": "BTC 狀態",
  "ETH Status": "ETH 狀態",
  "Status": "狀態",
  "Above $70,000": "高於 $70,000",
  "Below $65,000": "低於 $65,000",
  "Below $3,000": "低於 $3,000",
  "Triggered": "已觸發",
  "Active": "啟用中",
  "API issue": "資料服務異常",
  "Refreshing": "更新中",
  "Live": "即時資料",
  "Loading live market data…": "正在載入即時市場資料…",
  "24h unavailable": "暫無 24 小時變化",
  "Refresh failed. Showing last live price.": "更新失敗，目前顯示上次取得的即時價格。",
  "Live price unavailable": "暫時無法取得即時價格",
  "CoinGecko could not be reached.": "目前無法連線 CoinGecko。",
  "Retry": "再試一次",
  "Manage alerts": "管理提醒",
  "Not connected": "尚未連接",
  "Loading": "載入中",
  "Aave Health Factor": "Aave 健康係數",
  "Base · Aave V3 · read-only": "Base・Aave V3・唯讀",
  "Connect a wallet to monitor Base.": "連接錢包以監控 Base。",
  "No signature or transaction will be requested.": "不會要求簽名或發起交易。",
  "Connect Wallet": "連接錢包",
  "Reading Aave V3 on Base…": "正在讀取 Base 上的 Aave V3…",
  "Aave data unavailable": "暫時無法取得 Aave 資料",
  "No Aave position found on Base": "在 Base 上找不到 Aave 部位",
  "View Base monitor": "查看 Base 借貸監控",
  "Supplied": "存款",
  "Supply": "存款",
  "Borrowed": "借款",
  "Borrow": "借款",
  "Liquidation Risk": "清算風險",
  "Updated": "更新時間",
  "View position details": "查看部位詳情",
  "Ready to check Aave V3 Base.": "已準備檢查 Base Aave V3。",
  "One manual check only. Lobster Watch will not refresh in the background.": "每次只進行一次手動檢查，Lobster Watch 不會在背景自動更新。",
  "Refresh Aave Data": "更新 Aave 資料",
  "Next DCA Reminder": "下一次定投提醒",
  "Monthly planning check-in": "每月計畫檢查",
  "Today": "今天",
  "Review your BTC plan": "檢查你的 BTC 計畫",
  "Planning amount: $100": "規劃金額：$100",
  "Reviewed": "已完成",
  "Review Plan": "檢查計畫",
  "review": "計畫檢查",
  "Snooze": "稍後提醒",
  "View plan": "檢查計畫",
  "No purchase happens automatically.": "不會自動執行任何購買。",
  "Latest signals": "最新訊號",
  "Recent alerts": "最近提醒",
  "View all": "查看全部",
  "Notification history": "歷史提醒",
  "Alert Center": "提醒事項",
  "A calm record of what Lobster Watch noticed and reminded you about.": "用平靜清楚的方式，記錄 Lobster Watch 留意到並提醒你的事項。",
  "Mark all read": "全部標示已讀",
  "All": "全部",
  "System": "系統",
  "No alerts in this group": "此分類目前沒有提醒",
  "Try another filter.": "請試試其他分類。",
  "Detected": "偵測時間",
  "Source": "資料來源",
  "Mock reference data": "示範參考資料",
  "Delivery": "通知方式",
  "In-app · Email": "應用程式內・電子郵件",
  "What this means": "這代表什麼",
  "This alert reports a condition you chose to monitor. It is not a recommendation to buy, sell, borrow, or repay.": "這項提醒只回報你選擇監控的條件，不代表建議買入、賣出、借款或還款。",
  "Review related page": "查看相關頁面",
  "warning": "警示",
  "Warning": "警示",
  "Critical": "重要",
  "Resolved": "已處理",
  "notice": "提醒",
  "info": "資訊",
  "success": "已處理",
  "Health Factor crossed 1.50": "健康係數跌破 1.50",
  "Your monitored position moved from 1.58 to 1.43.": "你監控的部位從 1.58 下降至 1.43。",
  "BTC moved above $70,000": "BTC 上升至 $70,000 以上",
  "Reference price: $70,125 at 14:32.": "參考價格：14:32 時為 $70,125。",
  "Your BTC review is today": "今天要檢查 BTC 計畫",
  "You planned to review your monthly DCA decision at 19:00.": "你設定在 19:00 檢查每月定投決定。",
  "ETH moved below $3,000": "ETH 跌至 $3,000 以下",
  "Reference price: $2,986 at 09:15.": "參考價格：09:15 時為 $2,986。",
  "Price monitoring recovered": "價格監控已恢復",
  "BTC and ETH reference data is current again.": "BTC 與 ETH 參考資料已恢復正常。",
  "Yesterday": "昨天",
  "Read-only Base monitor": "Base 唯讀監控",
  "Monitor Aave V3 on Base without signatures, transactions, deposits, or borrowing.": "唯讀監控 Base 上的 Aave V3，不簽名、不交易、不存款，也不借款。",
  "Start with a public address": "從公開地址開始",
  "Connect Rabby or MetaMask": "連接 Rabby 或 MetaMask",
  "Lobster Watch will read your public Base Aave position. It will not request a signature or create a transaction.": "Lobster Watch 只會讀取你在 Base 上公開的 Aave 部位，不會要求簽名或建立交易。",
  "No signatures": "不需簽名",
  "No transactions": "不會交易",
  "No deposits or borrowing": "不會存款或借款",
  "This may take a few seconds.": "這可能需要幾秒鐘。",
  "Connected wallet": "已連接錢包",
  "Public data only": "僅讀取公開資料",
  "Manual refresh only": "僅手動更新",
  "Refresh could not be completed": "無法完成更新",
  "The last successfully loaded Aave data remains visible below.": "下方仍保留上次成功載入的 Aave 資料。",
  "Health Factor warning": "健康係數警示",
  "Your Health Factor is below 2.00.": "你的健康係數低於 2.00。",
  "A lower Health Factor may mean greater liquidation risk. Lobster Watch is read-only and cannot change your position.": "健康係數越低，清算風險可能越高。Lobster Watch 為唯讀工具，無法更改你的部位。",
  "Current Health Factor": "目前健康係數",
  "Green": "安全",
  "Yellow": "注意",
  "Red": "危險",
  "Last checked": "上次檢查",
  "Base data is current": "Base 資料為最新",
  "Live read-only position": "即時唯讀部位",
  "Wallet Address": "錢包地址",
  "Total Supplied": "存款總額",
  "Total Borrowed": "借款總額",
  "Available Borrow": "可借額度",
  "Net APY": "淨年化收益率",
  "Health Factor": "健康係數",
  "No active borrow": "目前無借款",
  "Supported Base positions": "支援的 Base 部位",
  "Live · manual refresh only": "即時資料・僅手動更新",
  "Supply APY": "存款年化收益率",
  "Borrow APY": "借款年化利率",
  "Plain-language guide": "白話說明",
  "This page only reads public Aave V3 data from Base. It cannot deposit, borrow, repay, withdraw, approve, or sign anything.": "此頁只讀取 Base 上公開的 Aave V3 資料，不能存款、借款、還款、提領、授權或簽名。",
  "Connected wallet · Base chain ID 8453": "已連接錢包・Base Chain ID 8453",
  "Ready to check Aave V3 Base": "已準備檢查 Base Aave V3",
  "Manual checks only": "僅手動檢查",
  "Steady habit, no auto-buy": "穩定養成習慣，不自動買入",
  "Schedule calm reminders to review your plan. No purchase happens automatically.": "設定不造成壓力的提醒，定期檢查計畫；不會自動購買。",
  "New reminder": "新增提醒",
  "Reviewed today": "今天已完成",
  "Next reminder · Today": "下一次提醒・今天",
  "Nice work checking your plan.": "你已完成計畫檢查。",
  "Review your BTC DCA plan": "檢查你的 BTC 定投計畫",
  "Your next reminder remains July 21 at 19:00.": "下一次提醒仍為 7 月 21 日 19:00。",
  "Your schedule": "你的時間表",
  "Active reminders": "目前提醒",
  "2 of 3 active": "3 項中有 2 項啟用",
  "Monthly": "每月",
  "Every 2 weeks": "每兩週",
  "Frequency": "頻率",
  "Next": "下次時間",
  "Planning amount": "規劃金額",
  "Edit reminder": "編輯提醒",
  "Add another reminder": "新增另一個提醒",
  "One slot remaining in this prototype": "此測試版還可新增一項提醒",
  "A reminder is not a recommendation.": "提醒不等於投資建議。",
  "Check your budget and current situation. You can review, skip, or adjust your plan without pressure.": "請先確認預算與目前狀況；你可以自在地檢查、略過或調整計畫。",
  "Your preferences": "個人偏好",
  "Control language, time, notifications, and privacy.": "管理語言、時區、通知與隱私。",
  "Account": "帳號資訊",
  "Email address": "電子郵件",
  "Sign out": "登出",
  "Language & time": "語言與時區",
  "Language": "語言",
  "Timezone": "時區",
  "Notifications": "通知設定",
  "Email notifications": "電子郵件通知",
  "Price, Aave, and DCA alerts": "價格、借貸與定投提醒",
  "Quiet hours": "勿擾時段",
  "Urgent Aave bypass": "緊急借貸通知",
  "Allow urgent alerts during quiet hours": "勿擾時段仍允許緊急提醒",
  "Send test email": "寄送測試郵件",
  "Safety & privacy": "安全與隱私",
  "Lobster Watch is read-only.": "Lobster Watch 為唯讀工具。",
  "It will never ask for your seed phrase, private key, or wallet signature.": "永遠不會要求助記詞、私鑰或錢包簽名。",
  "Save settings": "儲存設定",
  "Delete account": "刪除帳號",
  "Choose a public address to monitor. Lobster Watch will not request a signature.": "選擇要監控的公開地址；Lobster Watch 不會要求簽名。",
  "Detected in this browser": "已在此瀏覽器偵測到",
  "Extension not detected": "未偵測到擴充功能",
  "Not found": "找不到",
  "Read-only connection": "唯讀連接",
  "No transactions, deposits, borrowing, repayment, or wallet signatures.": "不會交易、存款、借款、還款或要求錢包簽名。",
  "You will receive one calm notification when the rule is crossed.": "當條件觸發時，你只會收到一次清楚的提醒。",
  "Asset": "資產",
  "Condition": "條件",
  "Above": "高於",
  "Below": "低於",
  "Target price · USD": "目標價格・美元",
  "Email notification": "電子郵件通知",
  "Also send this alert to your inbox": "同時將此提醒寄到你的信箱",
  "Cancel": "取消",
  "Save mock alert": "儲存示範提醒",
  "New DCA reminder": "新增定投提醒",
  "This schedules a review only. It never buys an asset.": "這只會安排檢查提醒，不會購買任何資產。",
  "Weekly": "每週",
  "Date": "日期",
  "Time": "時間",
  "Planning amount · optional": "規劃金額・選填",
  "Save mock reminder": "儲存示範提醒",
};

const publicPaths = new Set(["/", "/community", "/learn", "/on-ramp", "/dca-planner", "/earn", "/story", "/points", "/dashboard"]);

function translateDynamic(text: string) {
  let match = text.match(/^(\d+)% of entered income$/);
  if (match) return `占輸入收入的 ${match[1]}%`;
  match = text.match(/^(\d+)% of available amount$/);
  if (match) return `占可運用金額的 ${match[1]}%`;
  match = text.match(/^(\d+)% learning bucket$/);
  if (match) return `${match[1]}% 學習配置`;
  match = text.match(/^(\d+) years?$/);
  if (match) return `${match[1]} 年`;
  if (text.startsWith("Contributed: ")) return `累計投入：${text.slice(13)}`;
  if (text.startsWith("Illustrative difference: ")) return `示意差額：${text.slice(25)}`;
  if (window.location.pathname === "/dashboard") {
    match = text.match(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), (January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})$/);
    if (match) {
      const weekdays: Record<string, string> = {
        Sunday: "星期日", Monday: "星期一", Tuesday: "星期二", Wednesday: "星期三",
        Thursday: "星期四", Friday: "星期五", Saturday: "星期六",
      };
      const months: Record<string, number> = {
        January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
        July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
      };
      return `${months[match[2]]} 月 ${match[3]} 日・${weekdays[match[1]]}`;
    }
    const shortMonths: Record<string, string> = {
      JAN: "1月", FEB: "2月", MAR: "3月", APR: "4月", MAY: "5月", JUN: "6月",
      JUL: "7月", AUG: "8月", SEP: "9月", OCT: "10月", NOV: "11月", DEC: "12月",
    };
    if (shortMonths[text]) return shortMonths[text];
    match = text.match(/^(BTC|ETH) review$/);
    if (match) return `${match[1]} 計畫檢查`;
    match = text.match(/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}) · (.+)$/);
    if (match) {
      const months: Record<string, number> = {
        January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
        July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
      };
      return `${months[match[1]]} 月 ${match[2]} 日・${match[3]}`;
    }
    match = text.match(/^Wait (\d+)s$/);
    if (match) return `請等待 ${match[1]} 秒`;
    match = text.match(/^Try again in (\d+)s$/);
    if (match) return `${match[1]} 秒後再試`;
    match = text.match(/^Check again in (\d+)s$/);
    if (match) return `${match[1]} 秒後再次檢查`;
    match = text.match(/^Refresh available in (\d+)s$/);
    if (match) return `${match[1]} 秒後可再次更新`;
    match = text.match(/^Remind me to review my (BTC|ETH) plan\. No purchase happens automatically\.$/);
    if (match) return `提醒我檢查 ${match[1]} 計畫，不會自動執行購買。`;
    match = text.match(/^Notify me once when (BTC|ETH) moves (above|below) (.+)\.$/);
    if (match) return `${match[1]} ${match[2] === "above" ? "高於" : "低於"} ${match[3]} 時提醒我一次。`;
    match = text.match(/^(\d+) min ago$/);
    if (match) return `${match[1]} 分鐘前`;
    match = text.match(/^(\d+) hr ago$/);
    if (match) return `${match[1]} 小時前`;
    if (text.startsWith("CoinGecko · updated ")) return `CoinGecko・更新於 ${text.slice(20)}`;
    if (text.startsWith("Current Health Factor: ")) return `目前健康係數：${text.slice(23)}`;
    if (text.startsWith("Today at ")) {
      return text.replace("Today at ", "今天 ").replace("Asia/Taipei", "台北時間").replace("Planning amount", "規劃金額");
    }
    return lobsterZh[text] ?? zh[text] ?? text;
  }
  return zh[text] ?? text;
}

function replaceText(node: Text, language: Language, originals: WeakMap<Text, string>) {
  if (!originals.has(node)) originals.set(node, node.nodeValue ?? "");
  const original = originals.get(node) ?? "";
  if (language === "en") {
    if (node.nodeValue !== original) node.nodeValue = original;
    return;
  }
  const trimmed = original.trim();
  if (!trimmed) return;
  const translated = translateDynamic(trimmed);
  if (translated === trimmed) return;
  const start = original.match(/^\s*/)?.[0] ?? "";
  const end = original.match(/\s*$/)?.[0] ?? "";
  const next = `${start}${translated}${end}`;
  if (node.nodeValue !== next) node.nodeValue = next;
}

export function PublicLanguageSwitcher() {
  const [language, setLanguage] = useState<Language | null>(null);
  const originals = useRef(new WeakMap<Text, string>());

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setLanguage(stored === "en" ? "en" : "zh-TW");
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    const updateFromStorage = () => {
      setLanguage(window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh-TW");
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    window.addEventListener("storage", updateFromStorage);
    return () => {
      window.removeEventListener("baby-hippo-language-change", updateLanguage);
      window.removeEventListener("storage", updateFromStorage);
    };
  }, []);

  useEffect(() => {
    if (!language || !publicPaths.has(window.location.pathname)) return;
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);

    const apply = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        const parent = current.parentElement;
        if (
          parent &&
          !parent.closest("[data-language-static]") &&
          !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)
        ) {
          replaceText(current as Text, language, originals.current);
        }
        current = walker.nextNode();
      }
    };

    apply(document.body);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const parent = mutation.target.parentElement;
          if (parent && !parent.closest("[data-language-static]")) {
            replaceText(mutation.target as Text, language, originals.current);
          }
        } else {
          mutation.addedNodes.forEach((node) => apply(node));
        }
      }
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  const choose = (next: Language) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLanguage(next);
    window.dispatchEvent(new CustomEvent("baby-hippo-language-change", { detail: next }));
  };

  return (
    <div className="public-language-switcher" role="group" aria-label="Language">
      <button
        type="button"
        className={language === "zh-TW" ? "active" : ""}
        aria-pressed={language === "zh-TW"}
        onClick={() => choose("zh-TW")}
      >
        繁中
      </button>
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        aria-pressed={language === "en"}
        onClick={() => choose("en")}
      >
        EN
      </button>
    </div>
  );
}
