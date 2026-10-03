import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Chip, Container, Link, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ArrowBack, Apple, Android, AddToHomeScreen, NotificationsActive, IosShare, MoreVert } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import PushNotificationSettings from '../../components/PushNotificationSettings';

const siteUrl = 'https://mak-delivery.onrender.com/';

function Step({ number, title, children, icon }) {
  return <Stack direction="row" gap={1.5} sx={{ py: 1.5 }}>
    <Box sx={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', bgcolor: '#eeedff', color: '#5557d9', display: 'grid', placeItems: 'center', fontWeight: 800 }}>{number}</Box>
    <Box sx={{ minWidth: 0 }}><Stack direction="row" alignItems="center" gap={1}><Typography fontWeight={700}>{title}</Typography>{icon}</Stack><Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.8 }}>{children}</Typography></Box>
  </Stack>;
}

export default function InstallGuide() {
  const [device, setDevice] = useState(0);
  const { isAuthenticated, loading } = useAuth();
  return <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7fb', pb: 5 }}>
    <Container maxWidth="sm" sx={{ pt: 2 }}>
      <Button component={RouterLink} to="/" startIcon={<ArrowBack />} sx={{ mb: 2, textTransform: 'none' }}>返回首頁</Button>
      <Stack gap={2.5}>
        <Box><Chip label="Mak Delivery · 手機使用指南" size="small" sx={{ bgcolor: '#eeedff', color: '#5557d9', mb: 1.5 }} /><Typography component="h1" variant="h4" fontWeight={800} sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.35 }}>加入主畫面，<br />唔錯過取餐消息。</Typography><Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>將 Mak Delivery 儲存成手機 App（PWA），方便落單，再開啟你想收到嘅通知。</Typography></Box>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, borderColor: '#e5e5ef' }}>
          <Stack direction="row" gap={1} alignItems="center"><AddToHomeScreen color="primary" /><Typography component="h2" variant="h6" fontWeight={800}>1. 加入主畫面</Typography></Stack>
          <Tabs value={device} onChange={(_, value) => setDevice(value)} variant="fullWidth" aria-label="手機類型" sx={{ mt: 1 }}><Tab icon={<Apple />} iconPosition="start" label="iPhone / iPad" /><Tab icon={<Android />} iconPosition="start" label="Android" /></Tabs>
          {device === 0 ? <Box role="tabpanel" aria-label="iPhone 安裝步驟">
            <Step number="1" title="用 Safari 開啟網站">如果你係由 WhatsApp 或其他 App 入嚟，請先複製網址，再用 Safari 開啟 <Link href={siteUrl} sx={{ overflowWrap: 'anywhere' }}>Mak Delivery</Link>。</Step>
            <Step number="2" title="打開分享選單" icon={<IosShare fontSize="small" />}>撳 Share／分享（方框向上箭嘴）；部分版本要先打開 More／更多選單。</Step>
            <Step number="3" title="加入主畫面">揀 Add to Home Screen／加入主畫面。如果見到 Open as Web App／作為網頁 App 開啟，保持開啟，再撳 Add／加入。</Step>
            <Step number="4" title="由新圖示開啟">返回手機主畫面，撳 Mak Delivery 圖示。下一步要喺呢個 App 入面開通知。</Step>
            <Alert severity="info" sx={{ mt: 1 }}>iPhone／iPad 手機通知需要 iOS／iPadOS 16.4 或更新版本，並由主畫面 App 開啟。</Alert>
          </Box> : <Box role="tabpanel" aria-label="Android 安裝步驟">
            <Step number="1" title="用 Chrome 開啟網站">用 Chrome 開啟 <Link href={siteUrl}>Mak Delivery</Link>。</Step>
            <Step number="2" title="打開瀏覽器選單" icon={<MoreVert fontSize="small" />}>撳右上角 ⋮，揀 Add to Home screen／加入主畫面，再揀 Install／安裝。部分版本會直接顯示 Install app。</Step>
            <Step number="3" title="完成安裝，再開啟">跟畫面確認安裝，然後由主畫面嘅 Mak Delivery 圖示開啟。</Step>
          </Box>}
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, borderColor: '#e5e5ef' }}>
          <Stack direction="row" gap={1} alignItems="center"><NotificationsActive color="primary" /><Typography component="h2" variant="h6" fontWeight={800}>2. 登入同開啟通知</Typography></Stack>
          <Step number="1" title="登入你嘅帳戶">喺主畫面 App 登入。想減少重複登入，可以勾選 Keep me signed in for 30 days／保持登入 30 日。</Step>
          <Step number="2" title="開啟手機通知">撳 Phone notifications／手機通知，再撳 Enable phone notifications。手機詢問時揀 Allow／允許。</Step>
          <Step number="3" title="揀你想收到嘅消息">「取餐提醒」會提示預計到達時間；「新開單消息」會通知新一期開單。兩項可以獨立開關，最後撳 Save preferences 儲存。</Step>
          <Box sx={{ mt: 1, p: 2, bgcolor: '#f7f7fb', borderRadius: 2 }}><Typography variant="body2" sx={{ mb: 1 }}>{isAuthenticated ? '已登入，可以喺呢度打開通知設定。iPhone 請先確認係由主畫面 App 開啟。' : '安裝完成後，登入就可以設定通知。'}</Typography>{isAuthenticated ? <PushNotificationSettings /> : <Button component={RouterLink} to="/auth?redirect=/install-guide" variant="contained" disabled={loading}>登入設定通知</Button>}</Box>
        </Paper>

        <Box sx={{ px: 1 }}><Typography component="h2" fontWeight={800}>收唔到通知？</Typography><Stack gap={1} sx={{ mt: 1 }}><Typography variant="body2" color="text.secondary">iPhone 請由主畫面圖示開啟，唔好只喺 Safari 分頁開啟。Android 請檢查 Chrome 及網站嘅通知權限。</Typography><Typography variant="body2" color="text.secondary">之前揀咗「唔允許」？到手機或瀏覽器設定開返通知，再返回 App 開啟手機通知。亦要檢查勿擾／專注模式同網絡連線。</Typography><Typography variant="body2" color="text.secondary">每部手機都要各自開啟通知；登出會停用呢部手機嘅通知。未開手機通知，仍可以喺網站嘅鐘仔睇消息。</Typography></Stack><Stack direction="row" gap={2} sx={{ mt: 2 }}><Link href="https://support.apple.com/en-lamr/guide/iphone/iphea86e5236/ios" target="_blank" rel="noopener noreferrer" variant="caption">Apple 安裝指南</Link><Link href="https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=en" target="_blank" rel="noopener noreferrer" variant="caption">Chrome 安裝指南</Link></Stack></Box>
      </Stack>
    </Container>
  </Box>;
}
