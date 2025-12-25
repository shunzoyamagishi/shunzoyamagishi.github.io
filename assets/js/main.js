// プロジェクトデータの定義
const projects = {
  ja: {
    project1: {
        title: "PTZ映像からの選手位置推定",
        img: "images/MLB.jpg",
        description: "スポーツ現場での実用性の高いパン・チルト・ズーム（PTZ）カメラの映像から、選手のフィールド平面を推定可能なシステムです。ランドマークが疎なスポーツフィールドにおける動的なカメラワーク下での高精度な位置推定を実現しました。",
        tech: ["Python", "OpenCV", "scikit-learn","Camera Calibration"],
        role: "複数の査読付き国際会議にて発表。"
    },
    project2: {
        title: "選手位置推定精度向上のための座標決定法",
        img: "images/running.png",
        description: "単眼映像による選手フィールド位置推定法の精度向上を目的に、発展的な画像座標系における選手位置決定法を提案しました。提案手法は、スポーツ競技におけるジャンプ等の複雑な動作時においても従来より高精度な位置推定を可能にします。",
        tech: ["Python", "PyTorch", "Unity", "DeepLearning"],
        role: "Now in Progress...."
    },
    project3: {
        title: "SoccerNet Challenge 2025 GSR",
        img: "https://cdn.buttercms.com/MUfvkohlSPMrGHGYpyuq",
        description: "株式会社Playboxと株式会社MIXIの共同チームにて、CVPR 2025コンペティション「SoccerNet Challenge (Game State Reconstruction)」に参加。サッカーの放送映像から選手の3D位置やフィールド上の情報を再構成するパイプラインを開発しました。",
        tech: ["Python", "OpenCV", "scikit-learn","DeepLearning"],
        role: "自動カメラキャリブレーション部分の技術開発を担当。"
    },
    project4: {
        title: "Skateboard Ollie Simulator",
        img: "images/ollie.jpg",
        description: "筑波大学のエンパワースタジオ（大規模VR空間）を活用し、スケートボードのオーリーをVR空間で再現可能なシミュレーターを構築しました。",
        tech: ["VR/AR", "Unity", "Arduino"],
        role: "VR映像提示システムおよびマイクロコンピュータとの通信によるセンサデータ取得部分を担当。"
    }
  },
  en: {
      project1: {
        title: "Player Localization from PTZ Video",
        img: "images/MLB.jpg",
        description: "A system capable of estimating player positions on the field plane from Pan-Tilt-Zoom (PTZ) camera footage, which is highly practical for real-world sports analysis. It achieves high-precision localization even under dynamic camera work on sports fields with sparse landmarks.",
        tech: ["Python", "OpenCV", "scikit-learn", "Camera Calibration"],
        role: "Presented at multiple peer-reviewed international conferences."
    },
    project2: {
        title: "Coordinate Determination for Improved Localization Accuracy",
        img: "images/running.png",
        description: "To enhance the accuracy of player field position estimation from monocular video, I proposed an advanced coordinate determination method within the image coordinate system. This method enables more precise localization than conventional techniques, even during complex athletic movements such as jumping.",
        tech: ["Python", "PyTorch", "Unity", "Deep Learning"],
        role: "Now in Progress...."
    },
    project3: {
        title: "SoccerNet Challenge 2025 GSR",
        img: "https://cdn.buttercms.com/MUfvkohlSPMrGHGYpyuq",
        description: "Participated in the CVPR 2025 competition 'SoccerNet Challenge (Game State Reconstruction)' as part of a joint team from Playbox Inc. and MIXI, Inc. We developed a pipeline to reconstruct 3D player positions and field information from broadcast soccer footage.",
        tech: ["Python", "OpenCV", "scikit-learn", "Deep Learning"],
        role: "Responsible for the technical development of the automatic camera calibration module."
    },
    project4: {
        title: "Skateboard Ollie Simulator",
        img: "images/ollie.jpg",
        description: "Constructed a simulator that reproduces the skateboarding 'Ollie' in a VR environment, leveraging the University of Tsukuba's Empower Studio (a large-scale VR facility).",
        tech: ["VR/AR", "Unity", "Arduino"],
        role: "Responsible for the VR visual display system and sensor data acquisition via microcomputer communication."
    }
  }
};

// === 自分の名前（自動下線対象） ===
const MY_NAMES = [
  "Shunzo Yamagishi",
  "山岸 峻造"
];

function openModal(projectId, lang = "ja") {
    const data = projects[lang][projectId];
    if (!data) return;

    // コンテンツの注入
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-img').src = data.img;
    document.getElementById('modal-img').alt = data.title;
    document.getElementById('modal-description').textContent = data.description;
    document.getElementById('modal-role').textContent = data.role;

    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';
    data.tech.forEach(t => {
        const badge = document.createElement('span');
        badge.className = 'px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-bold rounded-full border border-sky-500/20';
        badge.textContent = t;
        techContainer.appendChild(badge);
    });

    // モーダル表示
    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');
    
    document.body.classList.add('modal-open');
    modal.classList.remove('hidden');
    
    // アニメーションのトリガー
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');
    
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }, 300);
}

// 背景クリックで閉じる
document.getElementById('project-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

function renderPubList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = items.map((p, i) => {
    const num = i + 1;

    const authors = p.authors
      ? `<p class="text-gray-300 text-sm mb-2">${underlineMyName(escapeHtml(p.authors))}</p>`
      : "";

    const venue = p.venue
      ? `<p class="text-xs text-gray-500 italic">${escapeHtml(p.venue)}</p>`
      : "";

    return `
      <div class="pub-item p-4 relative pl-12 transition-colors">
        <span class="absolute left-4 top-4 text-sky-500 font-bold">${num}.</span>
        <h4 class="text-white font-bold text-lg mb-1 leading-tight">${escapeHtml(p.title || "")}</h4>
        ${authors}
        ${venue}
      </div>
    `;
  }).join("");
}


function underlineMyName(authors) {
  if (!authors) return "";

  let result = authors;

  MY_NAMES.forEach(name => {
    // 正規表現エスケープ
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // 文字列に「ASCII文字（英数字・記号）以外」が含まれているかチェック
    const hasMultiByte = /[^\x00-\x7F]/.test(name);
    let re;

    if (hasMultiByte) {
      // 日本語が含まれる場合: 単語境界 \b を使わずに作成
      re = new RegExp(escaped, "g");
    } else {
      // 英語のみの場合: 単語境界 \b を使用して、部分一致を防ぐ
      re = new RegExp(`\\b${escaped}\\b`, "g");
    }

    result = result.replace(
      re,
      `<u>${name}</u>`
    );
  });

  return result;
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

