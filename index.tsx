import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Sliders, 
  AlertTriangle, 
  Layers, 
  Truck, 
  FileText, 
  Award, 
  CheckCircle2, 
  BellRing, 
  Building2, 
  Zap, 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  Download, 
  RefreshCw,
  Info,
  Clock,
  DollarSign,
  Droplets,
  Activity,
  UserCheck,
  PackageCheck
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('simulator');
  
  // Factory Selection
  const [selectedFactory, setSelectedFactory] = useState('โรงงานอมตะซิตี้ #4');

  // Alarm & Risk State
  const [riskLevel, setRiskLevel] = useState('warning'); // 'safe', 'warning', 'critical'
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [activeAlertStep, setActiveAlertStep] = useState(0);

  // What-If Simulation State
  const [rainIntensity, setRainIntensity] = useState(65); // mm/h
  const [waterLevel, setWaterLevel] = useState(0.8); // meters
  const [hoursToImpact, setHoursToImpact] = useState(4); // hours

  // Assets Management State
  const [assets, setAssets] = useState([
    { id: 1, name: 'หม้อแปลงไฟฟ้าหลัก (Main Power Transformer)', category: 'สาธารณูปโภค', value: 4500000, height: 0.2, moveTime: 3.5, priority: 1, status: 'เสี่ยงสูง' },
    { id: 2, name: 'เครื่องจักร CNC 5-Axis #01', category: 'เครื่องจักร', value: 8200000, height: 0.4, moveTime: 4.0, priority: 1, status: 'เสี่ยงสูง' },
    { id: 3, name: 'ตู้เซิร์ฟเวอร์หลัก และระบบ IT Backup', category: 'ระบบสารสนเทศ', value: 2800000, height: 0.1, moveTime: 1.5, priority: 1, status: 'วิกฤต' },
    { id: 4, name: 'คลังสินค้าวัตถุดิบ A (Raw Materials)', category: 'วัตถุดิบ', value: 5500000, height: 0.6, moveTime: 2.0, priority: 2, status: 'เฝ้าระวัง' },
    { id: 5, name: 'สินค้าสำเร็จรูป พร้อมส่งมอบ Lot 99', category: 'สินค้า', value: 3900000, height: 0.5, moveTime: 1.5, priority: 2, status: 'เฝ้าระวัง' },
    { id: 6, name: 'ชุดแม่พิมพ์ชิ้นส่วนยานยนต์ High Precision', category: 'อุปกรณ์', value: 6000000, height: 0.8, moveTime: 5.0, priority: 3, status: 'ปลอดภัย' }
  ]);

  const [newAsset, setNewAsset] = useState({ name: '', value: '', height: '0.3', moveTime: '2', priority: '1' });
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // Supply Chain Data
  const [suppliers, setSuppliers] = useState([
    { id: 'SUP-01', name: 'บจก. สยามแมคคานิคัล (Metal Stamping)', location: 'นิคมฯ บางปู, สมุทรปราการ', status: 'critical', impact: '35%', contact: '081-998-XXXX' },
    { id: 'SUP-02', name: 'บจก. ไทยอิเล็กทรอนิกส์เซนเซอร์', location: 'กบินทร์บุรี, ปราจีนบุรี', status: 'safe', impact: '0%', contact: '089-223-XXXX' },
    { id: 'SUP-03', name: 'บจก. โพลีเมอร์พลาสติกโซลูชัน', location: 'โรจนะ, พระนครศรีอยุธยา', status: 'warning', impact: '15%', contact: '086-441-XXXX' },
    { id: 'SUP-04', name: 'บจก. รวมขนส่ง โลจิสติกส์ไทย', location: 'บางพลี, สมุทรปราการ', status: 'warning', impact: '20%', contact: '082-334-XXXX' }
  ]);

  // Loss Ledger Records
  const [lossRecords, setLossRecords] = useState([
    { id: 'CLM-2024-01', date: '12 ต.ค. 2024', category: 'เครื่องจักร/อุปกรณ์', description: 'น้ำท่วมขังความสูง 30 ซม. มอเตอร์ปั๊มน้ำเสียหาย 3 ตัว', amount: 480000, status: 'อนุมัติจ่ายแล้ว' },
    { id: 'CLM-2024-02', date: '14 ต.ค. 2024', category: 'สต็อกสินค้า & วัตถุดิบ', description: 'กล่องบรรจุภัณฑ์กระดาษความเสียหายจากความชื้นสูง', amount: 250000, status: 'อยู่ระหว่างพิจารณา' },
    { id: 'CLM-2024-03', date: '15 ต.ค. 2024', category: 'หยุดการผลิต (Downtime)', description: 'พนักงานไม่สามารถเดินทางมาทำงานได้ หยุดผลิต 2 วัน', amount: 1200000, status: 'รอส่งเอกสารเพิ่ม' }
  ]);
  const [newLoss, setNewLoss] = useState({ category: 'เครื่องจักร/อุปกรณ์', description: '', amount: '' });

  // Resilience Assessment Questionnaire State
  const [resilienceAnswers, setResilienceAnswers] = useState({
    q1: 2, // Flood barrier: 0=none, 1=<0.5m, 2=>1m
    q2: 2, // Backup Generator: 0=ground, 1=raised, 2=roof/2nd floor
    q3: 1, // BCP Plan: 0=none, 1=written, 2=drilled annually
    q4: 2, // Drainage Pump: 0=none, 1=manual, 2=auto + backup power
    q5: 1  // Insurance: 0=none, 1=partial, 2=comprehensive Business Interruption
  });

  // Notification Contacts
  const [contacts, setContacts] = useState([
    { id: 1, name: 'คุณสมชาย วิสัยทัศน์', role: 'กรรมการผู้จัดการ (CEO)', phone: '081-234-5678', email: 'somchai@factory.co.th', line: '@somchai_ceo', notifyLevel: 'critical' },
    { id: 2, name: 'คุณวิชัย ความปลอดภัย', role: 'ผู้จัดการฝ่าย SHE & BCP', phone: '089-876-5432', email: 'wichai.s@factory.co.th', line: 'wichai_safety', notifyLevel: 'all' },
    { id: 3, name: 'คุณนภา วิศวกรรม', role: 'หัวหน้าทีมซ่อมบำรุง', phone: '086-555-4321', email: 'napa.eng@factory.co.th', line: 'napa_fix', notifyLevel: 'warning' }
  ]);
  const [newContact, setNewContact] = useState({ name: '', role: '', phone: '', email: '', line: '', notifyLevel: 'warning' });

  // ROI Calculator Input
  const [calcAssetValue, setCalcAssetValue] = useState(50000000); // 50M Baht default

  // Simulated Map Coordinates / Points
  const [simulatedZone, setSimulatedZone] = useState('พื้นที่นิคมฯ อมตะซิตี้ โซน 4');

  // Dynamic calculations based on simulation sliders
  const dynamicDamage = useMemo(() => {
    // Basic loss formula base on water level & rain intensity
    const riskFactor = (waterLevel * 0.6) + (rainIntensity / 200 * 0.4);
    const totalAssetVal = assets.reduce((acc, curr) => acc + curr.value, 0);
    
    // Affected assets based on height vs water level
    const endangeredAssets = assets.filter(a => a.height <= waterLevel);
    const endangeredVal = endangeredAssets.reduce((acc, curr) => acc + curr.value, 0);
    
    const estimatedLoss = Math.round(endangeredVal * Math.min(riskFactor * 1.2, 1.0));
    const estimatedDowntime = Math.round((waterLevel * 24) + (rainIntensity / 10));
    
    return {
      estimatedLoss,
      endangeredCount: endangeredAssets.length,
      totalAssetsCount: assets.length,
      estimatedDowntime,
      riskScore: Math.min(Math.round(riskFactor * 100), 99)
    };
  }, [waterLevel, rainIntensity, assets]);

  // Priority algorithm sort: Highest Loss per Hour required to move
  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      // Risk rank: Endangered first, then monetary value density (Value / MoveTime)
      const aAtRisk = a.height <= waterLevel ? 1 : 0;
      const bAtRisk = b.height <= waterLevel ? 1 : 0;
      if (bAtRisk !== aAtRisk) return bAtRisk - aAtRisk;
      
      const aDensity = a.value / Math.max(a.moveTime, 0.5);
      const bDensity = b.value / Math.max(b.moveTime, 0.5);
      return bDensity - aDensity;
    });
  }, [assets, waterLevel]);

  // Calculate Resilience Score (0 - 100)
  const resilienceScore = useMemo(() => {
    const totalPossible = 10;
    const currentScore = Object.values(resilienceAnswers).reduce((a, b) => a + b, 0);
    return Math.round((currentScore / totalPossible) * 100);
  }, [resilienceAnswers]);

  // Automatically update overall system risk badge if slider passes thresholds
  useEffect(() => {
    if (waterLevel > 0.7 || rainIntensity > 90) {
      setRiskLevel('critical');
    } else if (waterLevel > 0.3 || rainIntensity > 50) {
      setRiskLevel('warning');
    } else {
      setRiskLevel('safe');
    }
  }, [waterLevel, rainIntensity]);

  // Simulated multi-step alert test trigger
  const runAlertTest = () => {
    setTestModalOpen(true);
    setActiveAlertStep(1);
    setTimeout(() => setActiveAlertStep(2), 1200);
    setTimeout(() => setActiveAlertStep(3), 2500);
    setTimeout(() => setActiveAlertStep(4), 3800);
  };

  // Add Asset Handler
  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.value) return;
    const item = {
      id: Date.now(),
      name: newAsset.name,
      category: 'ทรัพย์สินใหม่',
      value: parseFloat(newAsset.value),
      height: parseFloat(newAsset.height),
      moveTime: parseFloat(newAsset.moveTime),
      priority: parseInt(newAsset.priority),
      status: parseFloat(newAsset.height) <= waterLevel ? 'เสี่ยงสูง' : 'ปลอดภัย'
    };
    setAssets([...assets, item]);
    setNewAsset({ name: '', value: '', height: '0.3', moveTime: '2', priority: '1' });
    setIsAssetModalOpen(false);
  };

  // Add Loss Claim Handler
  const handleAddLoss = (e) => {
    e.preventDefault();
    if (!newLoss.description || !newLoss.amount) return;
    const record = {
      id: `CLM-2024-0${lossRecords.length + 1}`,
      date: 'วันนี้',
      category: newLoss.category,
      description: newLoss.description,
      amount: parseFloat(newLoss.amount),
      status: 'บันทึกใหม่'
    };
    setLossRecords([record, ...lossRecords]);
    setNewLoss({ category: 'เครื่องจักร/อุปกรณ์', description: '', amount: '' });
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* TOP STATUS NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#0b1329]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* App Logo & Factory Switcher */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0b1329] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  SafeSphere <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-semibold">PRO v2.5</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">Industrial Flood Risk & Business Continuity System</p>
            </div>

            {/* Factory Selector */}
            <div className="hidden sm:flex items-center ml-4 pl-4 border-l border-slate-800">
              <Building2 className="w-4 h-4 text-slate-400 mr-2" />
              <select 
                value={selectedFactory} 
                onChange={(e) => setSelectedFactory(e.target.value)}
                className="bg-slate-900/80 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="โรงงานอมตะซิตี้ #4">โรงงานอมตะซิตี้ #4 (ชลบุรี)</option>
                <option value="โรงงานนิคมฯ โรจนะ #1">โรงงานนิคมฯ โรจนะ #1 (อยุธยา)</option>
                <option value="โรงงานนิคมฯ บางปู">โรงงานนิคมฯ บางปู (สมุทรปราการ)</option>
              </select>
            </div>
          </div>

          {/* Action Center & Emergency Status */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Live Risk Badge */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all ${
              riskLevel === 'critical' 
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/50 animate-pulse' 
                : riskLevel === 'warning'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                riskLevel === 'critical' ? 'bg-rose-500' : riskLevel === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              {riskLevel === 'critical' && 'วิกฤต: น้ำอ่างลำเชียงไกรทะลัก (🔴 Risk Level High)'}
              {riskLevel === 'warning' && 'ระดับเฝ้าระวัง: ฝนตกหนักต่อเนื่อง (🟡 Warning)'}
              {riskLevel === 'safe' && 'สภาวะปกติ (🟢 Normal Safe Status)'}
            </div>

            {/* Test Alert Button */}
            <button
              onClick={runAlertTest}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition"
            >
              <BellRing className="w-3.5 h-3.5" />
              ทดสอบแจ้งเตือนด่วน
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
          <div className="flex space-x-1 min-w-max pb-1">
            {[
              { id: 'simulator', label: 'แผนที่เตือนภัย & จำลอง', icon: MapPin },
              { id: 'rescue', label: 'จัดลำดับกู้ภัย/ย้ายทรัพย์สิน', icon: Sliders },
              { id: 'supply', label: 'เรดาร์ซัพพลายเชน', icon: Truck },
              { id: 'ledger', label: 'บัญชีเคลม/ยื่นประกัน', icon: FileText },
              { id: 'score', label: 'คะแนนความพร้อม', icon: Award },
              { id: 'pricing', label: 'แพ็กเกจ & คำนวณ ROI', icon: TrendingUp },
              { id: 'settings', label: 'ข้อมูลโรงงาน & แจ้งเตือน', icon: BellRing }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    active 
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* ==================== TAB 1: WHAT-IF MAP & SIMULATOR ==================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            
            {/* Top Alert Banner if Risk is high */}
            {riskLevel === 'critical' && (
              <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400">
                    <AlertTriangle className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-200">เตือนภัยพิบัติระดับสีแดง! มวลน้ำป่าไหลหลากเข้าใกล้พิกัดโรงงาน</h3>
                    <p className="text-xs text-rose-300/80">ประเมินเวลาน้ำท่วมถึงโรงงาน: ประมาณ <strong>{hoursToImpact} ชั่วโมง</strong> กรุณาเริ่มแผนเคลื่อนย้ายทรัพย์สินตามลำดับ Priority ด่วน</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('rescue')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-950 whitespace-nowrap transition"
                >
                  ดูรายการกู้ภัยย้ายด่วน &rarr;
                </button>
              </div>
            )}

            {/* Main Simulator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Map View Frame (8 Cols) */}
              <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">แผนที่จำลองระดับน้ำและรัศมีเตือนภัย (GIS Risk Contour Map)</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                    GPS: 13.3611° N, 101.0089° E
                  </span>
                </div>

                {/* Simulated Leaflet-style Graphic Canvas Map */}
                <div className="relative flex-1 min-h-[380px] bg-[#070d1e] p-6 flex flex-col justify-between overflow-hidden">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                  {/* Simulated Water Contour Overlay based on sliders */}
                  <div 
                    className="absolute rounded-full transition-all duration-700 ease-out pointer-events-none blur-md border border-rose-500/40"
                    style={{
                      width: `${Math.min(waterLevel * 300 + 100, 700)}px`,
                      height: `${Math.min(waterLevel * 300 + 100, 700)}px`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: waterLevel > 0.6 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.15)'
                    }}
                  />

                  {/* Outer Warning Ring */}
                  <div 
                    className="absolute rounded-full border border-dashed border-cyan-500/30 transition-all duration-700 pointer-events-none"
                    style={{
                      width: `${Math.min(rainIntensity * 5 + 200, 800)}px`,
                      height: `${Math.min(rainIntensity * 5 + 200, 800)}px`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />

                  {/* Map Pin: Factory Central Location */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-2xl shadow-cyan-500/40">
                        <Building2 className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                    </div>
                    <div className="mt-2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-lg text-center backdrop-blur-md shadow-xl">
                      <p className="text-xs font-bold text-white">{selectedFactory}</p>
                      <p className="text-[10px] text-slate-400">ระดับความสูงพื้นที่: +1.20m จาก MSL</p>
                    </div>
                  </div>

                  {/* Simulated Nearby River & Sensors */}
                  <div className="relative z-10 flex justify-between items-end text-xs text-slate-400">
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                        <Droplets className="w-3.5 h-3.5" /> Sensor 01: แม่น้ำบางปะกง
                      </div>
                      <p className="text-[11px] text-slate-300">อัตราการไหล: 1,450 cu.m/s</p>
                      <p className="text-[11px] text-amber-400">ระดับน้ำตลิ่ง: 88% (เฝ้าระวัง)</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-sm text-right">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1 justify-end">
                        <Activity className="w-3.5 h-3.5" /> IoT Rain Gauge
                      </div>
                      <p className="text-[11px] text-slate-300">ปริมาณฝนสะสม: {rainIntensity} มม./ชม.</p>
                      <p className="text-[11px] text-rose-400">คาดการณ์น้ำหลาก: {hoursToImpact} ชม.</p>
                    </div>
                  </div>

                </div>

                {/* Map Control Footer Bar */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> พิกัดโรงงาน</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> โซนเฝ้าระวัง</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> โซนท่วมขังวิกฤต</span>
                  </div>
                  <span>อัปเดตข้อมูลเซนเซอร์ล่าสุด: เมื่อครู่นี้ (Real-time)</span>
                </div>
              </div>

              {/* What-If Simulator Panel (4 Cols) */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Control Sliders Box */}
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      ระบบจำลองเหตุการณ์ (What-If)
                    </h3>
                    <button 
                      onClick={() => { setRainIntensity(65); setWaterLevel(0.8); setHoursToImpact(4); }}
                      className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" /> รีเซ็ต
                    </button>
                  </div>

                  {/* Slider 1: Rain Intensity */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">ความเข้มของฝน (Rainfall)</span>
                      <span className="font-bold text-cyan-400">{rainIntensity} มม./ชม.</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      value={rainIntensity} 
                      onChange={(e) => setRainIntensity(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>เบา (20)</span>
                      <span>ปานกลาง (50)</span>
                      <span>หนักมาก (120+)</span>
                    </div>
                  </div>

                  {/* Slider 2: Water Elevation Level */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">ระดับน้ำท่วมคาดการณ์ (Flood Height)</span>
                      <span className="font-bold text-rose-400">{waterLevel.toFixed(2)} เมตร</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.0" 
                      max="2.5" 
                      step="0.05"
                      value={waterLevel} 
                      onChange={(e) => setWaterLevel(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.1m (เสมอตาตุ่ม)</span>
                      <span>1.0m (ระดับเอว)</span>
                      <span>2.0m+ (มิดท่อน้ำ)</span>
                    </div>
                  </div>

                  {/* Slider 3: Hours to Impact */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">เวลาที่เหลือปะทะโรงงาน</span>
                      <span className="font-bold text-amber-400">{hoursToImpact} ชั่วโมง</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="24" 
                      value={hoursToImpact} 
                      onChange={(e) => setHoursToImpact(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                </div>

                {/* Predicted Impact Damage Summary Card */}
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ผลประเมินมูลค่าความเสียหายจำลอง</h4>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">ประเมินมูลค่าสูญเสียรวม (Estimated Total Loss)</p>
                      <p className="text-2xl font-black text-rose-400 tracking-tight">
                        ฿{dynamicDamage.estimatedLoss.toLocaleString()} <span className="text-xs font-normal text-slate-400">บาท</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">ทรัพย์สินที่อยู่ในจุดเสี่ยง</span>
                        <span className="text-base font-bold text-amber-300">{dynamicDamage.endangeredCount} / {dynamicDamage.totalAssetsCount} รายการ</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">เวลาโรงงานต้องหยุดผลิต</span>
                        <span className="text-base font-bold text-cyan-300">{dynamicDamage.estimatedDowntime} ชม.</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('rescue')}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    เริ่มแผนเคลื่อนย้ายความเสี่ยงด่วน &rarr;
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 2: RESCUE PRIORITY LEDGER ==================== */}
        {activeTab === 'rescue' && (
          <div className="space-y-6">
            
            {/* Header & Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  ลำดับกู้ภัย & เคลื่อนย้ายทรัพย์สิน (Rescue Priority Ledger)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  ระบบคำนวณลำดับการย้ายยึดตาม <strong>มูลค่าความสูญเสียต่อชั่วโมง (Loss/Hour Density)</strong> และระดับความสูงจากพื้นดิน เพื่อลดความเสียหายสูงสุด
                </p>
              </div>

              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/10 transition whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> เพิ่มรายการทรัพย์สิน
              </button>
            </div>

            {/* Priority Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                      <th className="py-3.5 px-4">ลำดับกู้ภัยแนะนำ</th>
                      <th className="py-3.5 px-4">ชื่อทรัพย์สิน / เครื่องจักร</th>
                      <th className="py-3.5 px-4">หมวดหมู่</th>
                      <th className="py-3.5 px-4 text-right">มูลค่าทรัพย์สิน (บาท)</th>
                      <th className="py-3.5 px-4">ระดับความสูงพื้น</th>
                      <th className="py-3.5 px-4">เวลาขนย้าย</th>
                      <th className="py-3.5 px-4">สถานะความเสี่ยงปัจจุบัน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {sortedAssets.map((asset, index) => {
                      const isEndangered = asset.height <= waterLevel;
                      return (
                        <tr key={asset.id} className={`hover:bg-slate-800/40 transition ${isEndangered ? 'bg-rose-950/10' : ''}`}>
                          <td className="py-4 px-4 font-bold">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                              index === 0 ? 'bg-rose-500 text-black ring-4 ring-rose-500/20' : 
                              index === 1 ? 'bg-amber-500 text-black' : 
                              'bg-slate-800 text-slate-300'
                            }`}>
                              #{index + 1}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-100">
                            {asset.name}
                          </td>
                          <td className="py-4 px-4 text-slate-400">{asset.category}</td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-cyan-300">
                            ฿{asset.value.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono text-slate-300">+{asset.height.toFixed(1)}m</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-300">
                            {asset.moveTime} ชม.
                          </td>
                          <td className="py-4 px-4">
                            {isEndangered ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950 border border-rose-500/50 text-rose-400">
                                <AlertTriangle className="w-3 h-3" /> ท่วมถึงแล้ว (ต้องย้ายด่วน!)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> อยู่ในเขตปลอดภัย
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Action Plan Tip */}
            <div className="p-4 bg-cyan-950/30 border border-cyan-800/40 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-cyan-200/90 leading-relaxed">
                <strong>คำแนะนำจากระบบ BCP:</strong> ในกรณีมีเวลาเหลือเพียง {hoursToImpact} ชั่วโมง ควรมุ่งเน้นเคลื่อนย้ายทรัพย์สินลำดับ #1 ถึง #{Math.min(2, sortedAssets.length)} ก่อน เนื่องจากรวมมูลค่าความคุ้มครองได้มากกว่า 75% ของทรัพย์สินทั้งหมดในโรงงาน
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: SUPPLY CHAIN RADAR ==================== */}
        {activeTab === 'supply' && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  เรดาร์เฝ้าระวังความเสี่ยง ห่วงโซ่อุปทาน (Supply Chain Radar)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  ติดตามสถานะคู่ค้า Tier-1 & Tier-2 ในพื้นที่เสี่ยงน้ำท่วม เพื่อเตรียมวัตถุดิบสำรองและปรับแผนการผลิตทันท่วงที
                </p>
              </div>
              
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> ผลกระทบกำลังผลิตรวม: -35%
                </span>
              </div>
            </div>

            {/* Supplier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suppliers.map((sup) => (
                <div key={sup.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">{sup.id}</span>
                      <h3 className="text-sm font-bold text-slate-100 mt-1.5">{sup.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" /> {sup.location}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      sup.status === 'critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      sup.status === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {sup.status === 'critical' && 'ถูกน้ำท่วมขัง (เส้นทางถูกตัด)'}
                      {sup.status === 'warning' && 'เฝ้าระวังน้ำขัง'}
                      {sup.status === 'safe' && 'ขนส่งปกติ'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">กระทบกำลังผลิตของโรงงานเรา</span>
                      <span className="font-bold text-rose-400">{sup.impact}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">ผู้ติดต่อฉุกเฉิน</span>
                      <span className="font-mono text-slate-200">{sup.contact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== TAB 4: LOSS LEDGER & INSURANCE ==================== */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400">รวมมูลค่าความเสียหายที่บันทึก</span>
                <p className="text-2xl font-black text-rose-400 mt-1">
                  ฿{lossRecords.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400">จำนวนรายการเคลมทั้งหมด</span>
                <p className="text-2xl font-black text-slate-100 mt-1">{lossRecords.length} รายการ</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">ออกรายงานสรุปยื่นประกันภัย</span>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">พร้อมยื่นเอกสาร (Ready to Export)</p>
                </div>
                <button 
                  onClick={() => alert('กำลังดาวน์โหลดรายงานสรุปเคลมประกันภัย SafeSphere_Loss_Claim_Report.pdf')}
                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold text-xs flex items-center gap-1 transition"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>
            </div>

            {/* Add New Record Form & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form (4 Cols) */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> บันทึกความเสียหายจริง (Real Loss)
                </h3>

                <form onSubmit={handleAddLoss} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">หมวดหมู่ความเสียหาย</label>
                    <select
                      value={newLoss.category}
                      onChange={(e) => setNewLoss({ ...newLoss, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="เครื่องจักร/อุปกรณ์">เครื่องจักร/อุปกรณ์</option>
                      <option value="สต็อกสินค้า & วัตถุดิบ">สต็อกสินค้า & วัตถุดิบ</option>
                      <option value="โครงสร้างอาคาร/โรงงาน">โครงสร้างอาคาร/โรงงาน</option>
                      <option value="หยุดการผลิต (Downtime)">หยุดการผลิต (Downtime)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">รายละเอียดเหตุการณ์ความเสียหาย</label>
                    <textarea
                      rows="3"
                      value={newLoss.description}
                      onChange={(e) => setNewLoss({ ...newLoss, description: e.target.value })}
                      placeholder="เช่น มอเตอร์ไฟฟ้าแช่น้ำท่วมขัง 4 ชั่วโมง..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">ประเมินมูลค่าความเสียหาย (บาท)</label>
                    <input
                      type="number"
                      value={newLoss.amount}
                      onChange={(e) => setNewLoss({ ...newLoss, amount: e.target.value })}
                      placeholder="เช่น 500000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/10 transition mt-2"
                  >
                    + บันทึกเข้าระบบ Ledger
                  </button>
                </form>
              </div>

              {/* Table (8 Cols) */}
              <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">รหัสเคลม</th>
                        <th className="py-3 px-4">วันที่บันทึก</th>
                        <th className="py-3 px-4">หมวดหมู่</th>
                        <th className="py-3 px-4">รายละเอียด</th>
                        <th className="py-3 px-4 text-right">มูลค่า (บาท)</th>
                        <th className="py-3 px-4">สถานะประกันภัย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {lossRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{r.id}</td>
                          <td className="py-3.5 px-4 text-slate-400">{r.date}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-300">{r.category}</td>
                          <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{r.description}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400">
                            ฿{r.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 5: RESILIENCE SCORE & BCP ==================== */}
        {activeTab === 'score' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Score Gauge Card (4 Cols) */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <Award className="w-10 h-10 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">คะแนนความพร้อมรับมือน้ำท่วมโรงงาน</h3>
                
                {/* Visual Circle Score */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" className="text-slate-800" fill="transparent" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      className={resilienceScore > 75 ? 'text-emerald-400' : resilienceScore > 50 ? 'text-amber-400' : 'text-rose-500'} 
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * resilienceScore) / 100}
                      strokeLinecap="round"
                      fill="transparent" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-slate-100">{resilienceScore}</span>
                    <span className="text-[10px] text-slate-400">เต็ม 100 คะแนน</span>
                  </div>
                </div>

                <div className="w-full pt-2">
                  <div className={`p-3 rounded-xl border text-xs font-semibold ${
                    resilienceScore >= 80 ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' :
                    resilienceScore >= 50 ? 'bg-amber-950/80 border-amber-500/40 text-amber-300' :
                    'bg-rose-950/80 border-rose-500/40 text-rose-300'
                  }`}>
                    {resilienceScore >= 80 && 'ระดับความพร้อมดีเยี่ยม (High Resilience Level)'}
                    {resilienceScore >= 50 && resilienceScore < 80 && 'ระดับความพร้อมปานกลาง (Moderate Resilience)'}
                    {resilienceScore < 50 && 'ระดับความเสี่ยงสูง ควรปรับปรุงแผน BCP ด่วน'}
                  </div>
                </div>
              </div>

              {/* Assessment Questions Form (8 Cols) */}
              <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> แบบประเมินโครงสร้างและระบบป้องกันภัยพิบัติ (Resilience Self-Assessment)
                </h3>

                <div className="space-y-4 text-xs">
                  
                  {/* Q1 */}
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold block">1. แนวคันกั้นน้ำและพนังป้องกันรอบโรงงาน (Flood Barriers)</label>
                    <select
                      value={resilienceAnswers.q1}
                      onChange={(e) => setResilienceAnswers({ ...resilienceAnswers, q1: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={0}>ไม่มีคันกั้นน้ำ หรือคันกั้นน้ำชั่วคราวถุงทราย</option>
                      <option value={1}>มีพนังกั้นน้ำสูงไม่เกิน 0.5 เมตร</option>
                      <option value={2}>มีพนังคอนกรีตถาวรสูงเกิน 1.0 เมตร พร้อมประตูน้ำมาตรฐาน</option>
                    </select>
                  </div>

                  {/* Q2 */}
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold block">2. การยกระดับตู้ควบคุมไฟฟ้า และเครื่องกำเนิดไฟฟ้าสำรอง (Backup Generators)</label>
                    <select
                      value={resilienceAnswers.q2}
                      onChange={(e) => setResilienceAnswers({ ...resilienceAnswers, q2: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={0}>ตั้งบนพื้นระดับดินปกติ (ระดับ 0.0m)</option>
                      <option value={1}>ยกสูงจากพื้นดิน 0.5 - 1.0 เมตร</option>
                      <option value={2}>ติดตั้งบนชั้น 2 หรือดาดฟ้าอาคาร (สูงกว่า 2.5m)</option>
                    </select>
                  </div>

                  {/* Q3 */}
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold block">3. แผนความต่อเนื่องทางธุรกิจ (Business Continuity Plan - BCP)</label>
                    <select
                      value={resilienceAnswers.q3}
                      onChange={(e) => setResilienceAnswers({ ...resilienceAnswers, q3: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={0}>ยังไม่มีเอกสารแผน BCP อย่างเป็นทางการ</option>
                      <option value={1}>มีแผน BCP เป็นลายลักษณ์อักษร แต่ยังไม่เคยซ้อมแผน</option>
                      <option value={2}>มีแผน BCP และมีการฝึกซ้อมอพยพ/กู้ภัยเป็นประจำทุกปี</option>
                    </select>
                  </div>

                  {/* Q4 */}
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold block">4. ระบบปั๊มสูบน้ำระบายออกจากพื้นที่โรงงาน (Drainage System)</label>
                    <select
                      value={resilienceAnswers.q4}
                      onChange={(e) => setResilienceAnswers({ ...resilienceAnswers, q4: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={0}>ไม่มีปั๊มระบายน้ำ</option>
                      <option value={1}>มีปั๊มสูบน้ำแบบกดสวิตช์มือ (Manual)</option>
                      <option value={2}>มีระบบปั๊มอัตโนมัติ พร้อมระบบไฟสำรอง และปั๊มสำรอง 100%</option>
                    </select>
                  </div>

                  {/* Q5 */}
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold block">5. ประกันภัยพิบัติและธุรกิจหยุดชะงัก (Business Interruption Insurance)</label>
                    <select
                      value={resilienceAnswers.q5}
                      onChange={(e) => setResilienceAnswers({ ...resilienceAnswers, q5: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={0}>ไม่มีประกันภัยน้ำท่วม</option>
                      <option value={1}>มีประกันเฉพาะสิ่งปลูกสร้างและเครื่องจักร</option>
                      <option value={2}>คุ้มครองครบถ้วน ทั้งทรัพย์สิน สินค้า และรายได้ขณะหยุดผลิต (BI Coverage)</option>
                    </select>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 6: PRICING PACKAGES & ROI CALCULATOR ==================== */}
        {activeTab === 'pricing' && (
          <div className="space-y-10 py-2">
            
            {/* Header Title section */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-white">
                แผนแพ็กเกจค่าบริการรายปีและการคำนวณผลตอบแทน ROI
              </h2>
              <p className="text-xs text-slate-400">
                เลือกแพ็กเกจที่เหมาะสมกับขนาดโรงงาน ป้องกันความสูญเสียหลักล้านในราคาเริ่มต้นเพียงหลักหมื่นต่อปี
              </p>
            </div>

            {/* Pricing Cards Grid (Matching User Prompt Image Specifications) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Card 1: BASIC PLAN */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition relative">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">BASIC PLAN</span>
                    <h3 className="text-lg font-extrabold text-slate-100">ระดับพื้นฐาน</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">฿ 0</span>
                    <span className="text-xs text-slate-400">/ โรงงาน / ปี (ฟรีค่าบริการ)</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-800/80 pb-4">
                    เหมาะสำหรับโรงงาน SME ขนาดเล็ก ที่ต้องการติดตามสถานการณ์และแจ้งเตือนเบื้องต้น
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>แผนที่แสดงพิกัดโรงงานและความเสี่ยง</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>การแจ้งเตือนระดับเฝ้าระวังผ่าน Email</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>แดชบอร์ดสรุปสถานการณ์น้ำสาธารณะ</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 line-through">
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>ระบบจำลอง What-If Simulator</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 line-through">
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>จัดลำดับย้ายของ Rescue Priority</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition">
                  เลือกแพ็กเกจ Basic
                </button>
              </div>

              {/* Card 2: STANDARD PLAN (MOST POPULAR) */}
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-400 rounded-2xl p-6 flex flex-col justify-between shadow-2xl shadow-cyan-500/10 relative transform -translate-y-1">
                
                {/* Most Popular Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-400 text-black font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  ยอดนิยมสูงสุด (MOST POPULAR)
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">STANDARD PLAN</span>
                    <h3 className="text-lg font-extrabold text-white">ระดับวางแผนปฏิบัติการ</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-cyan-400">฿ 59,000</span>
                    <span className="text-xs text-slate-400">/ โรงงาน / ปี</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-800/80 pb-4">
                    สำหรับโรงงานขนาดกลาง มูลค่าทรัพย์สิน 10-50 ล้านบาท ที่ต้องการเครื่องมือตัดสินใจด่วน
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-semibold text-white">รวมทุกฟังก์ชันใน Basic Plan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>ระบบจำลองสถานการณ์ What-If Simulator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>จัดลำดับย้ายทรัพย์สิน Rescue Priority</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>แจ้งเตือนด่วนระดับสูงผ่าน SMS & LINE</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>ระบบคำนวณบัญชี Loss Ledger</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full mt-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition">
                  เลือกแพ็กเกจ Standard
                </button>
              </div>

              {/* Card 3: ENTERPRISE PLAN */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition relative">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-indigo-400 uppercase">ENTERPRISE PLAN</span>
                    <h3 className="text-lg font-extrabold text-slate-100">ระดับองค์กรหลายสาขา</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">฿ 180,000</span>
                    <span className="text-xs text-slate-400">/ ปี (ไม่จำกัดโรงงาน)</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-800/80 pb-4">
                    สำหรับองค์กรขนาดใหญ่ ซัพพลายเชนซับซ้อน หรือต้องการเชื่อมต่อระบบ ERP/IoT ภายใน
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-white">รวมทุกฟังก์ชันระดับ Standard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>เรดาร์เฝ้าระวัง Supply Chain ทั้งหมด</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>การโทรแจ้งเตือนอัตโนมัติถึง CEO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>API Connector เชื่อมต่อ ERP / IoT</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Resilience Score & BCP Support</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition">
                  ติดต่อขอใบเสนอราคา Enterprise
                </button>
              </div>

            </div>

            {/* DYNAMIC ROI CALCULATOR */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">เครื่องมือคำนวณผลตอบแทนการลงทุน (ROI Calculator)</h3>
                  <p className="text-xs text-slate-400">เปรียบเทียบมูลค่าทรัพย์สินที่ช่วยป้องกันได้ กับค่าบริการรายปีของ SafeSphere PRO</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Input Slider (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-slate-300 font-medium">มูลค่าทรัพย์สินและเครื่องจักรในโรงงานของท่าน:</label>
                    <span className="text-base font-bold text-cyan-400 font-mono">฿{(calcAssetValue / 1000000).toFixed(1)} ล้านบาท</span>
                  </div>

                  <input 
                    type="range" 
                    min="5000000" 
                    max="200000000" 
                    step="5000000"
                    value={calcAssetValue} 
                    onChange={(e) => setCalcAssetValue(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>5 ล้านบาท</span>
                    <span>100 ล้านบาท</span>
                    <span>200 ล้านบาท</span>
                  </div>
                </div>

                {/* Calculation Outcome Display (6 Cols) */}
                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">มูลค่าความเสียหายที่ป้องกันได้ (Est. Saved)</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ฿{Math.round(calcAssetValue * 0.25).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">(ประเมินป้องกันความเสียหาย 25%)</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">อัตราผลตอบแทน ROI</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">
                      {Math.round(((calcAssetValue * 0.25) / 59000) * 100).toLocaleString()}%
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">(เทียบแพ็กเกจ Standard ฿59k)</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 7: SETTINGS & NOTIFICATION CONTACTS ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-cyan-400" />
                  ข้อมูลโรงงาน & ช่องทางแจ้งเตือนอัตโนมัติ (Notification Matrix)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  ตั้งค่าระดับความเสี่ยงและเลือกช่องทางส่งข้อความเตือนภัยไปยังผู้รับผิดชอบหลัก และผู้บริหารระดับสูง
                </p>
              </div>
            </div>

            {/* Notification Logic Matrix Card */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">เงื่อนไขการส่งสัญญาณเตือนภัย (Automatic Trigger Matrix)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Level 1 */}
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    ระดับเฝ้าระวัง (Watch Level - ฝนตกหนัก/น้ำเริ่มหนุน)
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    ส่งการแจ้งเตือนไปยัง: <strong>ฝ่ายความปลอดภัย SHE & maintenance</strong>
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-cyan-400" /> Email
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-400" /> LINE Notify
                    </span>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    ระดับวิกฤตสูง (Critical High Risk - น้ำป่าไหลหลาก)
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    ส่งการแจ้งเตือนไปยัง: <strong>CEO, ผู้บริหารระดับสูง & ทีมปฏิบัติการ BCP</strong>
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-amber-400" /> SMS ด่วน
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-rose-400" /> Automated Phone Call
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Master List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-100">รายชื่อผู้รับแจ้งเตือนฉุกเฉิน (Emergency Contacts Master)</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                      <th className="py-3 px-4">ตำแหน่ง</th>
                      <th className="py-3 px-4">เบอร์โทรศัพท์ (SMS/Call)</th>
                      <th className="py-3 px-4">อีเมล</th>
                      <th className="py-3 px-4">LINE ID</th>
                      <th className="py-3 px-4">เงื่อนไขแจ้งเตือน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-100">{c.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{c.role}</td>
                        <td className="py-3.5 px-4 font-mono text-cyan-300">{c.phone}</td>
                        <td className="py-3.5 px-4 text-slate-300">{c.email}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-mono">{c.line}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            c.notifyLevel === 'critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            c.notifyLevel === 'all' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {c.notifyLevel === 'critical' ? 'เฉพาะระดับวิกฤต' : c.notifyLevel === 'all' ? 'รับทุกการแจ้งเตือน' : 'ระดับเฝ้าระวังขึ้นไป'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ==================== MODAL 1: ADD ASSET MODAL ==================== */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> เพิ่มรายการทรัพย์สินในโรงงาน
              </h3>
              <button onClick={() => setIsAssetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">ชื่อทรัพย์สิน / เครื่องจักร</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ตู้ควบคุมไฟฟ้า MDB-02"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">มูลค่าทรัพย์สิน (บาท)</label>
                <input
                  type="number"
                  required
                  placeholder="เช่น 1500000"
                  value={newAsset.value}
                  onChange={(e) => setNewAsset({ ...newAsset, height: newAsset.height, value: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">ระดับความสูงจากพื้น (เมตร)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAsset.height}
                    onChange={(e) => setNewAsset({ ...newAsset, height: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">เวลาขนย้าย (ชั่วโมง)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAsset.moveTime}
                    onChange={(e) => setNewAsset({ ...newAsset, moveTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: MULTI-CHANNEL ALERT SIMULATION ==================== */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <BellRing className="w-5 h-5 animate-bounce" />
                จำลองการส่งสัญญาณเตือนภัย multi-channel
              </div>
              <button onClick={() => setTestModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Step 1: Email */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                activeAlertStep >= 1 ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200' : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>1. ส่ง Email Alert สรุปสภาวะน้ำท่วมไปยังทีม SHE & maintenance</span>
                </div>
                {activeAlertStep >= 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">กำลังส่ง...</span>}
              </div>

              {/* Step 2: LINE Notify */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                activeAlertStep >= 2 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>2. บรอดแคสต์ข้อความด่วนเข้ากลุ่ม LINE OA ผู้บริหารโรงงาน</span>
                </div>
                {activeAlertStep >= 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">รอส่ง...</span>}
              </div>

              {/* Step 3: Emergency SMS */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                activeAlertStep >= 3 ? 'bg-amber-950/60 border-amber-500/40 text-amber-200' : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>3. ส่ง SMS ฉุกเฉินตรงเข้ามือถือหัวหน้าแผนกรับผิดชอบ</span>
                </div>
                {activeAlertStep >= 3 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">รอส่ง...</span>}
              </div>

              {/* Step 4: Voice Phone Call */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                activeAlertStep >= 4 ? 'bg-rose-950/60 border-rose-500/40 text-rose-200' : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>4. ระบบ AI Call โทรศัพท์อัตโนมัติแจ้งเตือน CEO (081-234-XXXX)</span>
                </div>
                {activeAlertStep >= 4 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">รอส่ง...</span>}
              </div>
            </div>

            {activeAlertStep >= 4 && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 text-center font-medium">
                ✅ ทดสอบระบบส่งสัญญาณเตือนภัย 4 ช่องทางเรียบร้อยแล้ว
              </div>
            )}

            <button
              onClick={() => setTestModalOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
            >
              ปิดหน้าต่างทดสอบ
            </button>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-[#070d1e]">
        <p>© 2026 SafeSphere PRO - Industrial Flood Risk & Business Continuity System. All Rights Reserved.</p>
      </footer>

    </div>
  );
}