import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Users, MapPin, Shield, Clock, Info, Briefcase, Stethoscope, Calendar, HeartPulse, BookOpen, Microscope, HelpCircle, Phone, MessageSquare, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import redRibbonImage from '../../assets/red_ribbon_hands.png';

export function Landing() {
  const exploreItems = [
    { id: 'about', title: 'About Us', color: 'red', Icon: Info, points: [
      'Learn about our core mission to connect donors instantly.',
      'Understand our commitment to transparency and safety.',
      'Meet the dedicated team behind the RaktDaan initiative.'
    ]},
    { id: 'blood-camps', title: 'Blood Camps', color: 'blue', Icon: MapPin, points: [
      'Easily locate upcoming blood donation drives near you.',
      'Pre-register online to skip the queue at the camp.',
      'Track your participation history across different events.'
    ]},
    { id: 'emergency', title: 'Emergency Requests', color: 'teal', Icon: Activity, points: [
      'Get real-time alerts for critical blood requirements.',
      'Directly connect with patients or hospitals in need.',
      'Rely on our strict verification process for authenticity.'
    ]},
    { id: 'corporate', title: 'Corporate Partnerships', color: 'indigo', Icon: Briefcase, points: [
      'Collaborate to organize large-scale corporate drives.',
      'Enhance your company’s Corporate Social Responsibility footprint.',
      'Receive official partnership certificates and recognition.'
    ]},
    { id: 'health-checkups', title: 'Health Checkups', color: 'emerald', Icon: Stethoscope, points: [
      'Avail free routine health screenings for regular donors.',
      'Access basic vital reports post-donation securely.',
      'Consult experts regarding your iron and hemoglobin levels.'
    ]},
    { id: 'events', title: 'Events', color: 'orange', Icon: Calendar, points: [
      'Attend expert-led seminars on health and hematology.',
      'Participate in our annual donor felicitation programs.',
      'Join youth awareness rallies to spread the message.'
    ]},
    { id: 'health-tips', title: 'Health Tips', color: 'rose', Icon: HeartPulse, points: [
      'Discover expert diet recommendations for donors.',
      'Learn natural ways to boost your hemoglobin count.',
      'Read articles debunking common blood donation myths.'
    ]},
    { id: 'donor-stories', title: 'Donor Stories', color: 'purple', Icon: BookOpen, points: [
      'Read inspiring real-life journeys of everyday heroes.',
      'Witness how a single donation changed an entire family’s life.',
      'Share your own story to motivate thousands of others.'
    ]},
    { id: 'medical-research', title: 'Medical Research', color: 'cyan', Icon: Microscope, points: [
      'Stay updated on the latest blood preservation advancements.',
      'Understand the science behind rare blood types and genetics.',
      'Follow breakthrough research in synthetic blood technology.'
    ]},
    { id: 'faq', title: 'FAQ', color: 'yellow', Icon: HelpCircle, points: [
      'Find quick answers regarding age limits and eligibility.',
      'Learn about the recommended frequency of blood donation.',
      'Understand our strict privacy and data security policies.'
    ]},
    { id: 'contact', title: 'Contact Us', color: 'slate', Icon: Phone, points: [
      'Access our 24/7 dedicated support helpline.',
      'Find regional office addresses and local coordinators.',
      'Submit your valuable feedback through our portal.'
    ]},
    { id: 'testimonials', title: 'Testimonials', color: 'pink', Icon: MessageSquare, points: [
      'Read heartfelt messages from recovered patients.',
      'Hear doctors’ views on the impact of RaktDaan.',
      'Watch video messages from our growing community.'
    ]},
    { id: 'volunteer', title: 'Volunteer', color: 'green', Icon: UserPlus, points: [
      'Join our network as a ground-level coordinator.',
      'Help verify requests and manage donor operations.',
      'Receive specialized training to handle critical situations.'
    ]},
  ];

  const colorMap = {
    red: { border: 'border-red-50 hover:border-red-100', shadow: 'hover:shadow-red-200/60', icon: 'text-red-600 bg-red-100', dashed: 'border-red-200', blur: 'bg-red-200/40' },
    blue: { border: 'border-blue-50 hover:border-blue-100', shadow: 'hover:shadow-blue-200/60', icon: 'text-blue-600 bg-blue-100', dashed: 'border-blue-200', blur: 'bg-blue-200/40' },
    teal: { border: 'border-teal-50 hover:border-teal-100', shadow: 'hover:shadow-teal-200/60', icon: 'text-teal-600 bg-teal-100', dashed: 'border-teal-200', blur: 'bg-teal-200/40' },
    indigo: { border: 'border-indigo-50 hover:border-indigo-100', shadow: 'hover:shadow-indigo-200/60', icon: 'text-indigo-600 bg-indigo-100', dashed: 'border-indigo-200', blur: 'bg-indigo-200/40' },
    emerald: { border: 'border-emerald-50 hover:border-emerald-100', shadow: 'hover:shadow-emerald-200/60', icon: 'text-emerald-600 bg-emerald-100', dashed: 'border-emerald-200', blur: 'bg-emerald-200/40' },
    orange: { border: 'border-orange-50 hover:border-orange-100', shadow: 'hover:shadow-orange-200/60', icon: 'text-orange-600 bg-orange-100', dashed: 'border-orange-200', blur: 'bg-orange-200/40' },
    rose: { border: 'border-rose-50 hover:border-rose-100', shadow: 'hover:shadow-rose-200/60', icon: 'text-rose-600 bg-rose-100', dashed: 'border-rose-200', blur: 'bg-rose-200/40' },
    purple: { border: 'border-purple-50 hover:border-purple-100', shadow: 'hover:shadow-purple-200/60', icon: 'text-purple-600 bg-purple-100', dashed: 'border-purple-200', blur: 'bg-purple-200/40' },
    cyan: { border: 'border-cyan-50 hover:border-cyan-100', shadow: 'hover:shadow-cyan-200/60', icon: 'text-cyan-600 bg-cyan-100', dashed: 'border-cyan-200', blur: 'bg-cyan-200/40' },
    yellow: { border: 'border-yellow-50 hover:border-yellow-100', shadow: 'hover:shadow-yellow-200/60', icon: 'text-yellow-600 bg-yellow-100', dashed: 'border-yellow-200', blur: 'bg-yellow-200/40' },
    slate: { border: 'border-slate-50 hover:border-slate-100', shadow: 'hover:shadow-slate-200/60', icon: 'text-slate-600 bg-slate-100', dashed: 'border-slate-200', blur: 'bg-slate-200/40' },
    pink: { border: 'border-pink-50 hover:border-pink-100', shadow: 'hover:shadow-pink-200/60', icon: 'text-pink-600 bg-pink-100', dashed: 'border-pink-200', blur: 'bg-pink-200/40' },
    green: { border: 'border-green-50 hover:border-green-100', shadow: 'hover:shadow-green-200/60', icon: 'text-green-600 bg-green-100', dashed: 'border-green-200', blur: 'bg-green-200/40' },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden bg-slate-50 pt-36 pb-24">
        
        <style>
          {`
            @keyframes slideUpFade {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-slide-up-fade {
              animation: slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .delay-100 { animation-delay: 100ms; }
            .delay-200 { animation-delay: 200ms; }
            .delay-300 { animation-delay: 300ms; }
          `}
        </style>

        {/* Abstract Background Glowing Orbs (Light Theme) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-300/30 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-red-200/20 rounded-full blur-[150px] mix-blend-multiply"></div>
        </div>

        {/* Subtle Dot Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-8">
          {/* Large Circular Image */}
          <div className="w-[320px] h-[320px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full overflow-hidden mb-12 shadow-2xl shadow-slate-300/50 border-[16px] border-white relative group z-10 shrink-0 opacity-0 animate-slide-up-fade">
            <img 
              src={redRibbonImage} 
              alt="Donate Blood" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>

          <div className="max-w-4xl relative z-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.2] text-slate-900 drop-shadow-sm opacity-0 animate-slide-up-fade delay-100 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-600 hover:to-red-400 transition-all duration-500 cursor-default hover:scale-[1.02] transform">
              Donate Blood, Keep the World Beating
            </h1>
            
            <div className="relative max-w-3xl mx-auto mb-12 opacity-0 animate-slide-up-fade delay-200">
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic text-center hover:text-slate-900 transition-colors duration-300 cursor-default hover:-translate-y-1 transform">
                A single drop of blood can make a huge difference. You don't have to be a doctor to save lives—just be a donor.
              </p>
              <div className="flex items-center justify-center gap-4 mt-6 group cursor-default">
                <div className="h-px w-12 bg-red-300 group-hover:w-20 transition-all duration-500 group-hover:bg-red-500"></div>
                <span className="text-sm font-bold text-red-600 tracking-widest uppercase group-hover:text-red-500 group-hover:tracking-[0.25em] transition-all duration-500">The RaktDaan Mission</span>
                <div className="h-px w-12 bg-red-300 group-hover:w-20 transition-all duration-500 group-hover:bg-red-500"></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6 opacity-0 animate-slide-up-fade delay-300">
              <Link to="/#about">
                <Button size="lg" className="w-full sm:w-auto bg-[#d92c2c] hover:bg-red-700 text-white border-0 font-bold px-10 py-7 text-xl rounded-full shadow-xl shadow-red-200 hover:-translate-y-1 transition-all duration-300">
                  Discover More
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-bold px-10 py-7 text-xl rounded-full shadow-lg shadow-slate-100 hover:-translate-y-1 transition-all duration-300">
                  Start Donating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-red-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-[5%] left-[20%] w-[550px] h-[550px] bg-teal-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">How RaktDaan Works</h2>
            <p className="text-lg font-serif italic text-slate-500 tracking-wide leading-relaxed">A seamless process designed to connect those in need with those willing to help, in the shortest time possible.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-16 relative mt-16">
            {/* Connecting Horizontal Line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-2 bg-gradient-to-r from-red-200 via-blue-200 to-teal-200 -translate-y-1/2 hidden md:block rounded-full opacity-50"></div>

            {/* Step 1 - Red */}
            <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-white border-[12px] border-red-50 flex flex-col items-center justify-center p-8 text-center relative z-10 group hover:-translate-y-4 hover:shadow-2xl hover:shadow-red-200/60 hover:border-red-100 transition-all duration-500 cursor-default">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-200 animate-[spin_20s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-red-400 transition-all duration-300">1. Locate Request</h3>
              <p className="text-slate-500 leading-relaxed text-[15px] px-4 font-serif italic tracking-wide group-hover:text-slate-700 transition-colors">
                Hospitals or patients post an emergency requirement. Our system instantly alerts matching donors.
              </p>
            </div>

            {/* Step 2 - Blue */}
            <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-white border-[12px] border-blue-50 flex flex-col items-center justify-center p-8 text-center relative z-10 group hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-200/60 hover:border-blue-100 transition-all duration-500 cursor-default">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200 animate-[spin_20s_linear_infinite_reverse] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 shadow-inner">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300">2. Connect Securely</h3>
              <p className="text-slate-500 leading-relaxed text-[15px] px-4 font-serif italic tracking-wide group-hover:text-slate-700 transition-colors">
                Available donors accept the request. Contact details are shared securely to arrange the donation.
              </p>
            </div>

            {/* Step 3 - Teal/Light Blue */}
            <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-white border-[12px] border-teal-50 flex flex-col items-center justify-center p-8 text-center relative z-10 group hover:-translate-y-4 hover:shadow-2xl hover:shadow-teal-200/60 hover:border-teal-100 transition-all duration-500 cursor-default">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-200 animate-[spin_20s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-teal-400 transition-all duration-300">3. Save a Life</h3>
              <p className="text-slate-500 leading-relaxed text-[15px] px-4 font-serif italic tracking-wide group-hover:text-slate-700 transition-colors">
                The donor visits the hospital, donates blood, and updates the status. The platform tracks success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Platform */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Explore Our Platform</h2>
            <p className="text-xl text-slate-600">Discover everything we have to offer to make your blood donation journey smooth and meaningful.</p>
          </div>

          <div className="flex flex-col gap-16 md:gap-24 relative w-full">
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 -translate-x-1/2 hidden lg:block rounded-full opacity-50"></div>

            {exploreItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const colorCls = colorMap[item.color] || colorMap.blue;
              const bgColorClass = colorCls.icon.split(' ')[1]; // extracts the bg-color class from icon
              
              const circleContent = (
                <div className={`relative flex items-center justify-center group w-full lg:w-auto`}>
                  {/* Glowing Background Blur */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] ${colorCls.blur} rounded-full blur-[60px] opacity-40 mix-blend-multiply group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 pointer-events-none z-0`}></div>
                  
                  <div className={`w-80 h-80 md:w-96 md:h-96 rounded-full bg-white border-[12px] ${colorCls.border} flex flex-col items-center justify-center p-10 text-center relative z-10 hover:-translate-y-6 hover:shadow-2xl ${colorCls.shadow} transition-all duration-500`}>
                    
                    {/* Rotating Dashed Border */}
                    <div className={`absolute inset-0 rounded-full border-2 border-dashed ${colorCls.dashed} ${isEven ? 'animate-[spin_20s_linear_infinite]' : 'animate-[spin_20s_linear_infinite_reverse]'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                    
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 ${isEven ? 'group-hover:rotate-12' : 'group-hover:-rotate-12'} transition-transform duration-500 shadow-inner ${colorCls.icon} relative z-20`}>
                      <item.Icon size={40} />
                    </div>
                    <h3 className={`text-2xl font-extrabold text-slate-900 mb-4 group-hover:${colorCls.icon.split(' ')[0]} transition-colors relative z-20`}>{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base px-2 relative z-20">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );

              const textContent = (
                <div className={`w-full max-w-lg relative z-10 px-2 flex justify-center lg:justify-start`}>
                  <ul className="space-y-3 group inline-block p-4 -m-4 rounded-xl hover:bg-slate-50/50 transition-colors duration-500">
                    {item.points.map((point, i) => (
                      <li key={i} className={`flex items-start gap-3 cursor-default group-hover:translate-x-2 transition-transform duration-500`} style={{ transitionDelay: `${i * 50}ms` }}>
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${bgColorClass} ring-4 ring-${item.color}-100 shrink-0 shadow-sm group-hover:scale-150 transition-transform duration-300`}></div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors duration-300">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );

              return (
                <div key={index} id={item.id} className="relative flex flex-col lg:flex-row items-center w-full group scroll-mt-32">
                  {/* Left Side */}
                  <div className={`w-full lg:w-1/2 flex justify-center lg:justify-end px-4 lg:pr-24 lg:pl-4 mb-12 lg:mb-0 ${isEven ? 'order-1' : 'order-2 lg:order-1'}`}>
                    {isEven ? circleContent : textContent}
                  </div>

                  {/* Right Side */}
                  <div className={`w-full lg:w-1/2 flex justify-center lg:justify-start px-4 lg:pl-24 lg:pr-4 ${isEven ? 'order-2' : 'order-1 lg:order-2'}`}>
                    {isEven ? textContent : circleContent}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 font-serif italic">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Trust & Safety First</h2>
            <p className="text-lg font-serif italic text-slate-500 tracking-wide mb-8 leading-relaxed">
              We understand the critical nature of blood donation. That's why our platform is built on strict verification and privacy principles.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4 group">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 not-italic group-hover:bg-red-100 transition-colors">
                  <Shield className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-1">Verified Users</h4>
                  <p className="text-slate-600">All hospitals and organizations are thoroughly vetted before joining.</p>
                </div>
              </li>
              <li className="flex gap-4 group">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 not-italic group-hover:bg-red-100 transition-colors">
                  <Clock className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-1">Real-time Tracking</h4>
                  <p className="text-slate-600">Track the status of your emergency request minute-by-minute.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/2 w-full">
            <div className="bg-slate-100 rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2000&auto=format&fit=crop" alt="Doctor talking to patient" className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-600 text-white text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-400/40 rounded-full blur-[80px] mix-blend-overlay"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-400/40 rounded-full blur-[80px] mix-blend-overlay"></div>
          <div className="absolute top-[20%] left-[50%] w-[300px] h-[300px] bg-orange-400/20 rounded-full blur-[60px] mix-blend-overlay"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-md">Ready to make a difference?</h2>
          <p className="text-xl md:text-2xl text-red-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Join thousands of others who are actively saving lives in their communities. Registration takes less than 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-red-600 hover:bg-slate-50 font-bold text-lg px-8 py-4 h-auto rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300">
                Join as a Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
