/*
 * 매체별 소재 가이드 데이터
 * ------------------------------------------------------------
 * 출처: 매체별_소재규격_대시보드.md (최종 확인일 2026-11-16)
 * 규칙: 공식 문서에서 확인한 값만 넣는다. 확인 못 한 값은 넣지 않고 status: 'missing'.
 *
 * ▶ 나중에 PDF 내용을 추가하는 방법
 *   1) 아래 media 배열에서 해당 매체(status: 'missing')를 찾는다.
 *   2) status 를 'ok' (또는 'partial'), checkedAt, sources 를 채운다.
 *   3) products 배열에 상품과 items 를 넣는다. (Google 항목을 예시로 참고)
 *
 * item 필드
 *   type   : 'text' | 'image' | 'video' | 'logo' | 'html5' | 'etc'
 *   name   : 항목 이름 (예: '광고 제목')
 *   unit   : text 전용. 'byte' (전각 1자 = 2) | '자' (글자 수)
 *   limit  : text 전용. 최대 길이 숫자 (원문에 없으면 null)
 *   count  : text 전용. 엑셀에 만들 입력 줄 수 (원문의 최대 개수)
 *   spec   : 화면·엑셀에 그대로 보여줄 규격 문구
 *   safeZone : (선택) 세이프 존 비율 {top, bottom, side} — 미리보기 그림에 분홍색으로 표시
 *   refImage : (선택) 참고 이미지 경로 (예: 'images/meta_story.png') — 크게 보기 창에 표시
 *   refNote  : (선택) 참고 이미지 설명 / 출처
 */
// Meta 9:16 스토리·릴스 세이프 존 (MD 3장 원문 값)
const META_SAFE = { top: 14, bottom: 35, side: 6 };

window.GUIDE_DATA = {
  checkedAt: '2026-11-16',
  media: [
    {
      id: 'google', name: 'Google', status: 'ok', checkedAt: '2026-11-16',
      products: [
        {
          id: 'app', name: 'App 캠페인',
          source: { label: 'App campaigns specs', url: 'https://support.google.com/google-ads/answer/17091671' },
          items: [
            { id: 'headline', type: 'text', name: '광고 제목', unit: 'byte', limit: 30, count: 5, spec: '30byte · 1–5개 (권장 5) · 필수' },
            { id: 'desc', type: 'text', name: '설명', unit: 'byte', limit: 90, count: 5, spec: '90byte · 1–5개 (권장 5) · 필수' },
            { id: 'img-191', type: 'image', name: '이미지 가로 1.91:1', spec: '권장 1200×628 / 최소 600×314 · 최대 20개 · JPG·PNG 최대 5MB' },
            { id: 'img-45', type: 'image', name: '이미지 세로 4:5', spec: '권장 1200×1500 / 최소 320×400 · 최대 20개 · JPG·PNG 최대 5MB' },
            { id: 'img-11', type: 'image', name: '이미지 정사각 1:1', spec: '권장 1200×1200 / 최소 200×200 · 최대 20개 · JPG·PNG 최대 5MB' },
            { id: 'video', type: 'video', name: '동영상 (16:9 / 9:16 / 1:1)', spec: 'YouTube 업로드 필수 · 권장 10–60초 · 비율별 최대 20개' }
          ]
        },
        {
          id: 'pmax', name: 'PMAX',
          source: { label: 'Performance Max specs', url: 'https://support.google.com/google-ads/answer/17091269' },
          items: [
            { id: 'headline', type: 'text', name: '광고 제목', unit: 'byte', limit: 30, count: 15, spec: '30byte (최소 1개는 15byte 이하) · 3–15개 (권장 11+)' },
            { id: 'long-headline', type: 'text', name: '긴 광고 제목', unit: 'byte', limit: 90, count: 5, spec: '90byte · 1–5개 (권장 2+)' },
            { id: 'desc', type: 'text', name: '설명', unit: 'byte', limit: 90, count: 5, spec: '90byte · 2–5개 (권장 4+)' },
            { id: 'biz-name', type: 'text', name: '비즈니스 이름', unit: 'byte', limit: 25, count: 1, spec: '25byte · 필수' },
            { id: 'path', type: 'text', name: '표시 URL 경로', unit: 'byte', limit: 15, count: 2, spec: '각 15byte · 1–2개' },
            { id: 'img-191', type: 'image', name: '이미지 가로 1.91:1', spec: '권장 1200×628 / 최소 600×314 · 4개 이상 (최대 20) · 최대 5120KB' },
            { id: 'img-11', type: 'image', name: '이미지 정사각 1:1', spec: '권장 1200×1200 / 최소 300×300 · 4개 이상 (최대 20) · 최대 5120KB' },
            { id: 'img-45', type: 'image', name: '이미지 세로 4:5', spec: '권장 960×1200 / 최소 480×600 · 2개 이상 (최대 20) · 용량 원문 기재 없음' },
            { id: 'logo-11', type: 'logo', name: '로고 정사각 1:1 (필수)', spec: '권장 1200×1200 / 최소 128×128 · 최대 5120KB' },
            { id: 'logo-41', type: 'logo', name: '로고 가로 4:1', spec: '권장 1200×300 / 최소 512×128 · 최대 5120KB' },
            { id: 'video', type: 'video', name: '동영상 (16:9 / 1:1 / 9:16)', spec: '각 10초 이상 · 1–15개' }
          ]
        },
        {
          id: 'demandgen', name: '디맨드젠',
          source: { label: 'Demand Gen campaigns specs', url: 'https://support.google.com/google-ads/answer/17091672' },
          items: [
            { id: 'headline', type: 'text', name: '광고 제목', unit: 'byte', limit: 40, count: 5, spec: '40byte (최소 1개는 30byte 이하) · 1–5개 (권장 5) · 필수' },
            { id: 'desc', type: 'text', name: '설명', unit: 'byte', limit: 90, count: 5, spec: '90byte · 1–5개 (권장 3) · 필수' },
            { id: 'biz-name', type: 'text', name: '비즈니스 이름', unit: 'byte', limit: 25, count: 1, spec: '25byte · 1개 · 필수 (CTA는 자동)' },
            { id: 'img-191', type: 'image', name: '이미지 가로 1.91:1', spec: '권장 1200×628 / 최소 600×314 · 1–20개 (권장 3) · 필수' },
            { id: 'img-11', type: 'image', name: '이미지 정사각 1:1', spec: '권장 1200×1200 / 최소 300×300 · 1–20개 (권장 3) · 필수' },
            { id: 'img-45', type: 'image', name: '이미지 세로 4:5', spec: '권장 960×1200 / 최소 480×600 · 1–20개 (권장 3) · 선택' },
            { id: 'logo-11', type: 'logo', name: '로고 1:1', spec: '권장 1200×1200 / 최소 144×144 · 1–5개 (권장 1) · 필수' },
            { id: 'video-169', type: 'video', name: '동영상 가로 16:9', spec: '권장 10–60초 · 3개 · 선택' },
            { id: 'video-916', type: 'video', name: '동영상 세로 9:16 또는 4:5', spec: '권장 10–60초 · 3개 · 선택' },
            { id: 'video-11', type: 'video', name: '동영상 정사각 1:1', spec: '권장 10–60초 · 3개 · 선택' }
          ]
        },
        {
          id: 'vvc', name: 'VVC (동영상 조회)',
          source: { label: 'About Video views', url: 'https://support.google.com/google-ads/answer/13982458' },
          items: [
            { id: 'long-headline', type: 'text', name: '긴 광고 제목', unit: 'byte', limit: null, count: 1, spec: '멀티포맷 광고에 필수 · 글자 수 원문 미기재 → 미확인' },
            { id: 'desc', type: 'text', name: '설명', unit: 'byte', limit: null, count: 1, spec: '멀티포맷 광고에 필수 (인피드 노출에 필요) · 글자 수 원문 미기재 → 미확인' },
            { id: 'videos', type: 'video', name: '동영상', spec: '최대 5개 · 권장 구성: 가로 60초–3분 1개 + 가로 15초 1개 + 세로 10–60초 1개 · 인스트림·인피드 최소 5초' },
            { id: 'video-file', type: 'etc', name: '동영상 파일 형식', spec: '권장 .MPG (MPEG-2/4) · .MP4·.MOV 등 가능 · 256GB 미만 · 오디오 전용 파일 불가 (출처: Video ads specs)' },
            { id: 'thumb', type: 'image', name: '썸네일', spec: '16:9 · 1280×720 (최소 1280×640) · JPG·GIF·PNG · 2MB 미만 (출처: Video ads specs)' },
            { id: 'companion', type: 'image', name: '컴패니언 배너', spec: '5:1 · 300×60 · JPG·GIF·PNG · 150KB 미만 · 데스크톱만 (출처: Video ads specs)' }
          ]
        },
        {
          id: 'vrc', name: 'VRC (동영상 도달)',
          source: { label: 'Video reach campaigns', url: 'https://support.google.com/google-ads/answer/10581234' },
          items: [
            { id: 'headline', type: 'text', name: '광고 제목', unit: 'byte', limit: 90, count: 1, spec: '90byte (모바일 Shorts는 40byte 권장)' },
            { id: 'desc', type: 'text', name: '설명', unit: 'byte', limit: 90, count: 1, spec: '90byte' },
            { id: 'cta', type: 'text', name: 'CTA', unit: 'byte', limit: 10, count: 1, spec: '10byte' },
            { id: 'cta-headline', type: 'text', name: 'CTA 광고 제목 (선택)', unit: 'byte', limit: 30, count: 1, spec: '30byte' },
            { id: 'efficient', type: 'video', name: '효율적 도달 동영상', spec: '권장: 가로 15초 + 가로 6초 + 세로 6–60초 · 범퍼 6초 이하 · 세로는 인피드 노출 불가' },
            { id: 'nonskip', type: 'video', name: '건너뛸 수 없는 도달 동영상', spec: '가로 15초·30초·6초 권장 · 15초형 7–15초 / 30초 CTV 16–30초 / 범퍼 6초 이하 · 30초는 가로만 (정사각·세로 불가)' },
            { id: 'frequency', type: 'video', name: '타겟 빈도 동영상', spec: '가로만 · 건너뛸 수 있는 인스트림 길이 무관 / 건너뛸 수 없는 7–15초 / 범퍼 6초 이하' },
            { id: 'video-file', type: 'etc', name: '동영상 파일 형식', spec: '권장 .MPG (MPEG-2/4) · .MP4·.MOV 등 가능 · 256GB 미만 · 오디오 전용 파일 불가 (출처: Video ads specs)' },
            { id: 'thumb', type: 'image', name: '썸네일', spec: '16:9 · 1280×720 (최소 1280×640) · JPG·GIF·PNG · 2MB 미만 (출처: Video ads specs)' },
            { id: 'companion', type: 'image', name: '컴패니언 배너', spec: '5:1 · 300×60 · JPG·GIF·PNG · 150KB 미만 · 데스크톱만 (출처: Video ads specs)' }
          ]
        }
      ]
    },
    {
      id: 'meta', name: 'Meta', status: 'ok', checkedAt: '2026-11-16',
      products: [
        {
          id: 'app-install', name: '앱 설치 목표',
          source: { label: 'Meta 광고 가이드', url: 'https://www.facebook.com/business/ads-guide/update/video/facebook-feed/app-installs' },
          items: [
            { id: 'fbfeed-primary', type: 'text', name: 'FB 피드 기본 문구', unit: '자', limit: 150, count: 1, spec: '권장 50–150자' },
            { id: 'fbfeed-title', type: 'text', name: 'FB 피드 제목', unit: '자', limit: 27, count: 1, spec: '권장 27자' },
            { id: 'fbstory-primary', type: 'text', name: 'FB 스토리 기본 문구', unit: '자', limit: 125, count: 1, spec: '권장 125자' },
            { id: 'fbstory-title', type: 'text', name: 'FB 스토리 제목', unit: '자', limit: 40, count: 1, spec: '권장 40자' },
            { id: 'igfeed-primary', type: 'text', name: 'IG 피드 기본 문구', unit: '자', limit: 125, count: 1, spec: '권장 125자 · 해시태그 최대 30개' },
            { id: 'igfeed-title', type: 'text', name: 'IG 피드 제목 (이미지)', unit: '자', limit: 40, count: 1, spec: '권장 40자' },
            { id: 'igstory-primary', type: 'text', name: 'IG 스토리 기본 문구', unit: '자', limit: 125, count: 1, spec: '권장 125자' },
            { id: 'reels-primary', type: 'text', name: 'IG 릴스 기본 문구', unit: '자', limit: 44, count: 1, spec: '권장 44자' },
            { id: 'an-primary', type: 'text', name: 'AN 보상형 기본 문구', unit: '자', limit: 125, count: 1, spec: '권장 125자' },
            { id: 'an-title', type: 'text', name: 'AN 보상형 제목', unit: '자', limit: 40, count: 1, spec: '권장 40자' },
            { id: 'an-desc', type: 'text', name: 'AN 보상형 설명', unit: '자', limit: 30, count: 1, spec: '권장 30자' },
            { id: 'fbfeed-video', type: 'video', name: 'FB 피드 동영상 4:5', spec: '1440×1800 · MP4·MOV·GIF · 최대 4GB · 1초–241분 · 최소 120×120' },
            { id: 'fbfeed-image', type: 'image', name: 'FB 피드 이미지 4:5', spec: '1440×1800 · JPG·PNG · 최대 30MB · 최소 너비 600px (4:5 최소 높이 750px) · 비율 오차 3%' },
            { id: 'fbstory-video', type: 'video', safeZone: META_SAFE, name: 'FB 스토리 동영상 9:16', spec: '1440×2560 · MP4·MOV·GIF · 최대 4GB · 1초–3분 · 최소 너비 250px · 비율 오차 1%' },
            { id: 'igfeed-video', type: 'video', name: 'IG 피드 동영상 9:16', spec: '1080×1920 · MP4·MOV·GIF · 최대 4GB · 1초–60분 · 최소 너비 250px · 비율 오차 1%' },
            { id: 'igfeed-image', type: 'image', name: 'IG 피드 이미지 4:5', spec: '1440×1800 · JPG·PNG · 최대 30MB · 최소 너비 500px · 비율 오차 1%' },
            { id: 'igstory-video', type: 'video', safeZone: META_SAFE, name: 'IG 스토리 동영상 9:16', spec: '1440×2560 · MP4·MOV·GIF · 최대 4GB · 1초–60분 · 최소 너비 250px · 비율 오차 1%' },
            { id: 'igstory-image', type: 'image', safeZone: META_SAFE, name: 'IG 스토리 이미지 9:16', spec: '1440×2560 · JPG·PNG · 최대 30MB · 최소 너비 500px · 비율 오차 1%' },
            { id: 'reels-video', type: 'video', safeZone: META_SAFE, name: 'IG 릴스 동영상 9:16', spec: '1440×2560 · MP4·MOV · 최대 4GB · 0초–15분 · 최소 너비 30초 미만 250px / 30초 이상 500px' },
            { id: 'an-video', type: 'video', name: 'AN 보상형 동영상 9:16', spec: '1080×1080 이상 · MP4·MOV·GIF · 최대 4GB · 3–61초' },
            { id: 'safezone', type: 'etc', name: '세이프 존 (9:16 스토리·릴스)', spec: '상단 14% · 하단 35% · 좌우 각 6%에 텍스트·로고·주요 요소 배치 금지' },
            { id: 'video-common', type: 'etc', name: '동영상 공통 권장 설정', spec: 'H.264 · 정사각형 픽셀 · 고정 프레임 · 프로그레시브 스캔 · 128kbps 이상 스테레오 AAC' }
          ]
        }
      ]
    },
    {
      id: 'moloco', name: 'Moloco', status: 'ok', checkedAt: '2026-11-16',
      products: [
        {
          id: 'native', name: '네이티브',
          source: { label: 'Native creative guide', url: 'https://help.moloco.com/hc/articles/7104698037911' },
          items: [
            { id: 'title', type: 'text', name: '제목', unit: '자', limit: 70, count: 1, spec: '최대 70자 (공백 포함) · 25바이트 이하·이모지 지양 권장' },
            { id: 'sponsored', type: 'text', name: 'Sponsored By', unit: '자', limit: 25, count: 1, spec: '최대 25자' },
            { id: 'desc', type: 'text', name: '설명', unit: '자', limit: 90, count: 1, spec: '최대 90자 (이모지 가능)' },
            { id: 'cta', type: 'text', name: 'CTA 텍스트', unit: '자', limit: 100, count: 1, spec: '최대 100자' },
            { id: 'icon', type: 'logo', name: '앱 아이콘 1:1', spec: '256×256 이상 · PNG 권장 (JPEG·JPG·GIF 가능) · 최대 500KB' },
            { id: 'native-image', type: 'image', name: '네이티브 이미지', spec: '1200×628, 1200×600, 1200×222, 720×720, 720×960, 720×1280, 1200×1600 · JPEG·JPG·PNG·GIF · 최대 500KB (GIF 1MB) · 한국 카카오 인벤토리는 1200×600 필요' },
            { id: 'native-video', type: 'video', name: '네이티브 동영상', spec: 'MP4 · 가로 16:9 1280×720 권장 / 세로 9:16 720×1280 권장 / 1:1 가능 · 최소 640px · 6–100초 (30초 내외 권장) · 24fps 이상 · 최대 10MB' },
            { id: 'thumb', type: 'image', name: '동영상 썸네일', spec: '360×480, 360×640, 480×360, 480×480, 640×360, 720×720, 720×960, 720×1280, 800×418, 1280×720, 1200×628 (동영상 비율과 일치) · 최대 500KB (GIF 1MB)' }
          ]
        },
        {
          id: 'video', name: '동영상 (일반)',
          source: { label: 'Video creative guide', url: 'https://help.moloco.com/hc/articles/7104841219095' },
          items: [
            { id: 'video', type: 'video', name: '동영상', spec: 'MP4 · 가로·세로 비율 제한 없음, 정사각 1:1 · 가로 또는 세로 640px 이상 (720px 이상 권장) · 6–180초 · 업로드 최대 450MB · 24fps 이상' },
            { id: 'endcard', type: 'image', name: '엔드카드', spec: 'JPEG·JPG·PNG·GIF · 가로·세로 320px 이상 · 동영상 방향과 일치 · 최대 500KB (GIF 1MB)' }
          ]
        },
        {
          id: 'playable', name: '플레이어블·IEC',
          source: { label: 'Playable and IEC creative guide', url: 'https://help.moloco.com/hc/articles/24124525963799' },
          items: [
            { id: 'html5', type: 'html5', name: 'HTML5 플레이어블', spec: '.html/.htm · 5MB 미만 · 세로·가로 모두 지원' }
          ]
        }
      ]
    },
    {
      id: 'tiktok', name: 'TikTok', status: 'partial', checkedAt: '2026-11-16',
      note: '광고 설명·캡션 글자 수, Pangle·Global App Bundle 지면 규격은 미확인',
      products: [
        {
          id: 'infeed', name: 'Auction In-Feed (Non-Spark)',
          source: { label: 'TikTok Auction In-Feed Ads', url: 'https://ads.tiktok.com/resources/help/article/tiktok-auction-in-feed-ads?lang=en-GB' },
          items: [
            { id: 'account', type: 'text', name: '계정명', unit: '자', limit: 10, count: 1, spec: '1줄 · 한·중·일 최대 10자 (그 외 언어 20자)' },
            { id: 'video-916', type: 'video', name: '동영상 세로 9:16', spec: '540×960 이상 (권장) · .mp4 .mov .mpeg .3gp .avi · 500MB 이하 · 최대 10분 · 516kbps 이상' },
            { id: 'video-169', type: 'video', name: '동영상 가로 16:9', spec: '960×540 이상 · .mp4 .mov .mpeg .3gp .avi · 500MB 이하 · 최대 10분 · 516kbps 이상' },
            { id: 'video-11', type: 'video', name: '동영상 정사각 1:1', spec: '640×640 이상 · .mp4 .mov .mpeg .3gp .avi · 500MB 이하 · 최대 10분 · 516kbps 이상' },
            { id: 'profile', type: 'logo', name: '프로필 이미지 (선택)', spec: '98×98, 1:1 · JPG·JPEG·PNG · 50KB 미만 · 핵심 요소는 중앙 66×66 안에' }
          ]
        }
      ]
    },
    {
      id: 'x', name: 'X', status: 'ok', checkedAt: '2026-11-16',
      products: [
        {
          id: 'ads', name: '프로모션 광고',
          source: { label: 'Creative ad specs', url: 'https://business.x.com/en/help/campaign-setup/creative-ad-specifications' },
          items: [
            { id: 'post', type: 'text', name: '게시물 문구', unit: '자', limit: 280, count: 1, spec: '280자 (링크 1개당 23자 차감 → 257자)' },
            { id: 'image', type: 'image', name: '이미지', spec: '권장 800×418 (1.91:1) 또는 800×800 (1:1) · PNG·JPEG 권장 · 최대 5MB · 지원: 4:5 1440×1800 / 2:3 1080×1620 / 1:1 1080×1080 / 1.91:1 2064×1080 / 16:9 1920×1080 / 9:16 1080×1920' },
            { id: 'video', type: 'video', name: '동영상', spec: 'MP4·MOV · 최대 1GB (30MB 미만 강력 권장) · 15초 이하 권장, 최대 2분 20초 · 권장 1:1 1200×1200 / 16:9 1920×1080 · H.264 / AAC LC' },
            { id: 'video-vertical', type: 'video', name: '세로형 동영상 9:16', spec: '720×1280–1080×1920 · 15초 미만 권장 (최대 2분 20초) · 최대 60fps · 5–10Mbps (최대 25Mbps)' },
            { id: 'thumb', type: 'image', name: '동영상 썸네일', spec: 'PNG·JPEG · 최대 5MB' }
          ]
        }
      ]
    },
    {
      id: 'kakao', name: '카카오', status: 'ok', checkedAt: '2026-11-16',
      note: '비즈보드 규격 변경: 1029×258 → 960×300',
      products: [
        {
          id: 'bizboard', name: '비즈보드',
          source: { label: '카카오 비즈보드 제작 가이드', url: 'https://kakaobusiness.gitbook.io/main/ad/moment/performance/talkboard/content-guide' },
          items: [
            { id: 'badge', type: 'text', name: '뱃지 (썸네일형)', unit: '자', limit: 8, count: 1, spec: '최대 8자 (최소 4자 권장) · 행동 유도 문구 불가' },
            { id: 'multi-title', type: 'text', name: '멀티 이미지 제목 (익스팬더블)', unit: '자', limit: 25, count: 1, spec: '최대 25자' },
            { id: 'banner', type: 'image', name: '배너', spec: '960×300 · PNG-24 · 300KB 이하 · 투명 배경 · 광고주 식별 요소 필수' },
            { id: 'copy', type: 'etc', name: '카피 스타일', spec: '메인 Pretendard Bold 46pt #191919 / 서브 Regular 38pt #696969 / 카피 길이 240–526px / 3줄 권장 (최대 4줄)' },
            { id: 'object', type: 'image', name: '오브젝트 영역', spec: '배너툴 314×300 / PSD 최대 388×300 · 가시 폭 219px 이상 권장 · 투명 PNG 150KB 이하' },
            { id: 'thumbnail', type: 'image', name: '썸네일 영역', spec: '320×222, 모서리 18px · JPG·JPEG·PNG (투명 불가) · 10MB 이하 · 텍스트 50% 이하' },
            { id: 'exp-video', type: 'video', name: '익스팬더블 동영상', spec: '1280×720 이상, 16:9 · 1GB 미만 · 3초 이상 · 맞춤 썸네일 1280×720, 500KB 이하' },
            { id: 'exp-image', type: 'image', name: '익스팬더블 이미지', spec: '1200×600 이상, 2:1 · 500KB 미만' },
            { id: 'exp-multi', type: 'image', name: '익스팬더블 멀티 이미지', spec: '1080×1080 · 1MB 미만 · 3–5장' }
          ]
        }
      ]
    },

    // ---------- 미확인 매체 (PDF 확인 후 채울 자리) ----------
    { id: 'appier', name: 'Appier', status: 'missing', note: '공개 규격 문서 없음 → AM에게 스펙 시트 요청', products: [] },
    { id: 'naver', name: '네이버 (성과형 DA)', status: 'missing', note: '공식 가이드 원문 미확인', products: [] },
    { id: 'soop', name: 'SOOP', status: 'missing', note: '미디어킷 요청 필요', products: [] },
    { id: 'playio', name: '플레이오', status: 'missing', note: '소재 가이드 요청 필요', products: [] },
    { id: 'inven', name: '인벤', status: 'missing', note: '미디어킷 요청 필요', products: [] },
    { id: 'dc', name: '디시인사이드', status: 'missing', note: '미디어킷 요청 필요', products: [] },
    { id: 'ruliweb', name: '루리웹', status: 'missing', note: '미디어킷 요청 필요', products: [] },
    { id: 'arca', name: '아카라이브', status: 'missing', note: '규격 요청 필요', products: [] },
    { id: 'reddit', name: 'Reddit', status: 'missing', note: '공식 원문 미확인', products: [] },
    { id: 'toss', name: '토스 (토스애즈)', status: 'missing', note: '공식 규격 원문 미확인', products: [] },
    { id: 'daangn', name: '당근', status: 'missing', note: '공식 규격 원문 미확인', products: [] },
    { id: 'blind', name: '블라인드', status: 'missing', note: '상품 소개서 요청 필요', products: [] },
    { id: 'remember', name: '리멤버', status: 'missing', note: '상품 소개서 요청 필요', products: [] },
    { id: 'pinterest', name: 'Pinterest', status: 'missing', note: '공식 페이지 직접 열람 필요', products: [] },
    { id: 'laftel', name: '라프텔', status: 'missing', note: '상품 소개서 요청 필요', products: [] }
  ]
};
