/**
 * Projects Loader
 * JSONファイルからプロジェクト情報を取得し、カードを生成して表示します。
 * HTMLのlang属性に基づいて表示言語（ja/en）を切り替えます。
 */

document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-grid');
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    
    // モーダル内の要素
    const mTitle = document.getElementById('modal-title');
    const mImg = document.getElementById('modal-img');
    const mDesc = document.getElementById('modal-description');
    const mTech = document.getElementById('modal-tech');
    const mRole = document.getElementById('modal-role');

    // JSONデータのパス
    const JSON_PATH = '/data/projects.json';

    // 言語設定の取得 (htmlタグのlang属性を確認、デフォルトは 'ja')
    const currentLang = document.documentElement.lang === 'en' ? 'en' : 'ja';

    // 1. データフェッチとレンダリング
    fetch(JSON_PATH)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // 現在の言語に対応するデータ配列を取得
            const projects = data[currentLang] || data['ja'];
            
            if (!projects || projects.length === 0) {
                projectsContainer.innerHTML = '<p class="text-gray-500">No projects found.</p>';
                return;
            }

            renderProjects(projects);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectsContainer.innerHTML = '<p class="text-red-400">プロジェクトの読み込みに失敗しました。</p>';
        });

    /**
     * プロジェクトカードを生成してDOMに追加する関数
     */
    function renderProjects(projects) {
        projectsContainer.innerHTML = ''; // コンテナをクリア

        projects.forEach(project => {
            // 色のテーマ設定 (sky または indigo)
            const isIndigo = project.color === 'indigo';
            const borderColor = isIndigo ? 'border-indigo-600/50' : 'border-sky-600/50';
            const bgColor = isIndigo ? 'bg-indigo-900/10' : 'bg-sky-900/10';
            const titleColor = isIndigo ? 'text-indigo-300' : 'text-sky-300';
            
            // カードのHTML生成
            const card = document.createElement('div');
            card.className = `project-card p-4 border ${borderColor} rounded-lg ${bgColor} transition duration-300 cursor-pointer hover:bg-opacity-20`;
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-thumbnail w-full h-40 object-cover rounded-md mb-4 transition duration-300">
                <h3 class="text-xl font-bold ${titleColor} mb-1">${project.title}</h3>
                <p class="text-gray-400 line-clamp-2">${project.summary}</p>
            `;

            // クリックイベント設定
            card.addEventListener('click', () => openProjectModal(project));

            projectsContainer.appendChild(card);
        });
    }

    /**
     * モーダルを開く関数
     */
    function openProjectModal(project) {
        // コンテンツの流し込み
        mTitle.textContent = project.title;
        mImg.src = project.image;
        mImg.alt = project.title;
        mDesc.innerHTML = project.details.description || ''; // HTMLタグ許可
        mRole.textContent = project.details.role || '-';

        // 技術スタック（タグ）の生成
        mTech.innerHTML = '';
        if (project.details.tech && Array.isArray(project.details.tech)) {
            project.details.tech.forEach(tech => {
                const badge = document.createElement('span');
                badge.className = 'px-2 py-1 text-xs font-semibold bg-gray-700 text-gray-300 rounded border border-gray-600';
                badge.textContent = tech;
                mTech.appendChild(badge);
            });
        }

        // モーダル表示アニメーション
        modal.classList.remove('hidden');
        // 少し遅らせてopacityを変更することでフェードインさせる
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        
        document.body.style.overflow = 'hidden'; // 背景スクロール禁止
    }

    /**
     * モーダルを閉じる関数
     */
    window.closeModal = function() {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // スクロール解除
        }, 300); // transition durationと合わせる
    };

    // モーダルの背景クリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closeModal();
        }
    });

    // Escapeキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            window.closeModal();
        }
    });
});