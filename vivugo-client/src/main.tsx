import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './contexts/app.context.tsx'

// TỐI ƯU HÓA CACHING Ở ĐÂY
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Không tự động gọi lại API khi user chuyển tab trình duyệt
      retry: 0,                    // Nếu lỗi thì không gọi lại ngay (tránh spam server)
      staleTime: 5 * 60 * 1000,    // Dữ liệu được coi là "tươi" trong 5 phút (sẽ lấy từ cache mà không gọi API)
      gcTime: 10 * 60 * 1000       // Dữ liệu rác sẽ bị dọn dẹp sau 10 phút nếu không dùng đến
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <App />
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
