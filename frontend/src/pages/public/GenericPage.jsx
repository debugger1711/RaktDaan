import React from 'react';

export function GenericPage({ title, description, content }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">{title}</h1>
          <p className="text-xl md:text-2xl text-brand-100 font-light max-w-2xl mx-auto">{description}</p>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Overview</h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-10">
              {content || `Welcome to the ${title} page. We are continuously working on bringing you the most comprehensive information and resources. This dedicated space will soon be filled with detailed insights, actionable tools, and updates related to ${title.toLowerCase()} to help you engage better with the RaktDaan community.`}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-8 bg-brand-50 rounded-2xl border border-brand-100/50 hover:shadow-md transition-shadow">
                 <h3 className="font-bold text-xl mb-3 text-brand-700">Why it matters</h3>
                 <p className="text-slate-700 leading-relaxed">Your participation makes a huge difference. Every step you take helps save lives and build a stronger, healthier community. Stay tuned for more in-depth content.</p>
              </div>
              <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100/50 hover:shadow-md transition-shadow">
                 <h3 className="font-bold text-xl mb-3 text-blue-700">Get Involved</h3>
                 <p className="text-slate-700 leading-relaxed">Explore the different ways you can contribute. From organizing drives to spreading the word among your network, every little effort counts towards our mission.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
