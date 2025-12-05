

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar.jsx'
import Header from '../../components/layout/Header.jsx'   

export default function DashboardLayout() {
	return (
		<div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
			
			{/* 1. القائمة الجانبية - ستكون ثابتة على اليسار */}
			<Sidebar />

			{/* 2. المحتوى الرئيسي - سيأخذ باقي المساحة */}
			<div className="flex flex-col flex-1">
				
				{/* الشريط العلوي - سيكون ثابتاً في الأعلى */}
				<Header />

				{/* 
          3. منطقة المحتوى المتغير 
          الـ <Outlet /> هو مكون خاص من react-router-dom.
          سيتم استبداله تلقائياً بمكون الصفحة التي يزورها المستخدم.
          (مثال: إذا كان الرابط /dashboard، سيعرض مكون Dashboard.jsx هنا)
        */}
				<div className="flex-1 p-4 min-h-0 overflow-auto">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
