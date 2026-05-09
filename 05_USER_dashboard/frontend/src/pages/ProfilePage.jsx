import { Avatar, Skeleton, Spinner } from '../components/UI.jsx';
import { fetchProfile, updateProfile } from '../redux/userSliceTunk/userSice.js';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, MapPin, GraduationCap, Eye,
  Plus, X, Save, ChevronDown, Camera, BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Data Constants ───────────────────────────────────────────────────────────
const PROVINCES = [
  'Punjab (Including Islamabad)', 'Sindh', 'Khyber Pakhtunkhwa',
  'Balochistan', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir',
];

const DISTRICTS_BY_PROVINCE = {
  'Punjab (Including Islamabad)': [
    'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan',
    'Sialkot', 'Bahawalpur', 'Sargodha', 'Islamabad', 'Jhelum',
    'Gujrat', 'Sheikhupura', 'Rahim Yar Khan', 'Attock', 'Chakwal',
  ],
  'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas', 'Thatta'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Mansehra'],
  'Balochistan': ['Quetta', 'Turbat', 'Khuzdar', 'Hub', 'Gwadar'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Ghanche'],
  'Azad Jammu & Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bagh'],
};

const RELIGIONS = ['Islam', 'Christianity', 'Hinduism', 'Sikhism', 'Buddhism', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];

const DEGREE_TYPES = [
  'Matric (SSC)', 'Intermediate (HSSC)', "Bachelor's", "Master's",
  'M.Phil', 'PhD', 'Diploma', 'Certificate', 'Other',
];
const DEGREE_CATEGORIES = [
  'Arts', 'Science', 'Commerce', 'Engineering', 'Medical',
  'Computer Science', 'Law', 'Education', 'Agriculture', 'Other',
];

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User, grad: 'from-teal-500 to-emerald-600' },
  { id: 'address', label: 'Address', icon: MapPin, grad: 'from-purple-500 to-pink-500' },
  { id: 'education', label: 'Education', icon: GraduationCap, grad: 'from-orange-400 to-red-500' },
  { id: 'preview', label: 'Preview', icon: Eye, grad: 'from-cyan-500 to-blue-500' },
];

const emptyQual = () => ({
  id: Date.now(),
  degreeType: '', category: '', specialization: '',
  institution: '', yearOfCompletion: String(new Date().getFullYear()), grade: '',
});

// ─── Small Helpers ────────────────────────────────────────────────────────────
const Field = ({ label, required, children, col2 = false }) => (
  <div className={col2 ? 'md:col-span-2' : ''}>
    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Inp = ({ className = '', ...p }) => (
  <input className={`w-full bg-slate-700/50 text-slate-50 placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm border border-slate-700
    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition-all duration-150 ${className}`} {...p} />
);

const Sel = ({ value, onChange, children }) => (
  <div className="relative">
    <select value={value} onChange={onChange}
      className="w-full appearance-none bg-slate-700/50 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm text-slate-50
        focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition-all">
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
  </div>
);

const Txt = ({ ...p }) => (
  <textarea className="w-full bg-slate-700/50 text-slate-50 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400
    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition-all resize-none" {...p} />
);

const SectionBanner = ({ icon: Icon, title, sub, grad }) => (
  <div className={`rounded-2xl bg-gradient-to-r ${grad} p-5 mb-7 text-white`}>
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="font-bold text-lg leading-tight">{title}</h2>
        <p className="text-white/75 text-sm mt-0.5">{sub}</p>
      </div>
    </div>
  </div>
);

const PF = ({ label, value }) => (
  <div className="py-3 border-b border-slate-700 last:border-0">
    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-sm text-slate-200 font-medium">
      {value || <span className="text-slate-400 italic text-xs">Not provided</span>}
    </p>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const dispatch = useDispatch();
  const { profile, profileLoading, updateLoading } = useSelector((s) => s.user);
  const { user } = useSelector((s) => s.auth);
  const fileRef = useRef();

  const [tab, setTab] = useState('personal');
  const [dirty, setDirty] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [newQual, setNewQual] = useState(emptyQual());

  const [form, setForm] = useState({
    name: '', bio: '', skills: [], profileImage: '',
    fatherName: '', mobileNumber: '', whatsappNumber: '', cnic: '',
    dateOfBirth: '', gender: 'Male', religion: '', maritalStatus: 'Single',
    disabilityStatus: 'No',
    domicileProvince: '', domicileDistrict: '', city: '',
    permanentAddress: '', postalAddress: '',
    qualifications: [],
  });

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      profileImage: profile.profileImage || '',
      fatherName: profile.fatherName || '',
      mobileNumber: profile.mobileNumber || '',
      whatsappNumber: profile.whatsappNumber || '',
      cnic: profile.cnic || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      gender: profile.gender || 'Male',
      religion: profile.religion || '',
      maritalStatus: profile.maritalStatus || 'Single',
      disabilityStatus: profile.disabilityStatus || 'No',
      domicileProvince: profile.domicileProvince || '',
      domicileDistrict: profile.domicileDistrict || '',
      city: profile.city || '',
      permanentAddress: profile.permanentAddress || '',
      postalAddress: profile.postalAddress || '',
      qualifications: profile.qualifications || [],
    });
  }, [profile]);

  const set = (k, v) => { setDirty(true); setForm((f) => ({ ...f, [k]: v })); };
  const handle = (e) => set(e.target.name, e.target.value);

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s) || form.skills.length >= 20) return;
    set('skills', [...form.skills, s]);
    setSkillInput('');
  };

  const addQual = () => {
    if (!newQual.degreeType || !newQual.institution) {
      toast.error('Degree type and institution are required');
      return;
    }
    set('qualifications', [...form.qualifications, { ...newQual, id: Date.now() }]);
    setNewQual(emptyQual());
  };

  const removeQual = (id) => set('qualifications', form.qualifications.filter((q) => q.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(res)) { toast.success('Profile saved!'); setDirty(false); }
    else toast.error(res.payload || 'Failed to save');
  };

  const cu = profile || user;
  const districts = DISTRICTS_BY_PROVINCE[form.domicileProvince] || [];

  if (profileLoading && !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {[60, 140, 400].map((h) => <Skeleton key={h} className={`h-${h === 60 ? 12 : h === 140 ? 32 : 96} rounded-2xl`} />)}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950">
      <div className="max-w-5xl mx-auto py-4 h-full">

        {/* ── Hero Card ── */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-3xl mb-4 overflow-hidden shadow-sm">
          <div className="h-24 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 relative">
            <div className="absolute inset-0 opacity-8"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
          </div>
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-10 mb-3">
              {/* Avatar */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-22 rounded-2xl border-4 border-slate-800 shadow-lg overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center cursor-pointer"
                  onClick={() => fileRef.current?.click()}>
                  {form.profileImage
                    ? <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" onError={() => set('profileImage', '')} />
                    : <span className="text-white font-bold text-2xl">{cu?.name?.[0]?.toUpperCase() || '?'}</span>
                  }
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
                    const reader = new FileReader();
                    reader.onload = (ev) => set('profileImage', ev.target.result);
                    reader.readAsDataURL(file);
                  }} />
              </div>

              <div className="pb-1 flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-50 truncate">{cu?.name || 'Your Name'}</h1>
                <p className="text-sm text-slate-300 truncate">{cu?.email}</p>
                {form.domicileProvince && (
                  <p className="text-xs text-teal-300 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} />{form.domicileProvince}
                  </p>
                )}
              </div>
              {dirty && (
                <div className="shrink-0 pb-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Unsaved
                  </span>
                </div>
              )}
            </div>

            {/* Skills chips */}
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700/40 border border-slate-700 text-slate-200 text-xs font-semibold">
                    {s}
                    <button type="button" onClick={() => set('skills', form.skills.filter((x) => x !== s))}
                      className="hover:text-red-400 transition-colors"><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-800/50 p-1 rounded-2xl shadow-sm border border-slate-700">
          {TABS.map(({ id, label, icon: Icon, grad }) => (
            <button key={id} type="button" onClick={() => setTab(id)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all
                ${tab === id
                  ? `bg-gradient-to-r ${grad} text-white shadow-md`
                  : 'text-slate-300 hover:text-slate-50 hover:bg-slate-700/30'}`}>
              <Icon size={14} /><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-3xl shadow-sm">

            {/* ══ PERSONAL ══ */}
            {tab === 'personal' && (
              <div style={{ animation: 'fadeUp .3s ease' }}>
                <SectionBanner icon={User} title="Personal Information"
                  sub="Your basic details and contact information"
                  grad="from-teal-500 to-emerald-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                  <Field label="Full Name" required>
                    <Inp name="name" value={form.name} onChange={handle} placeholder="e.g. Faizan Zahid" />
                  </Field>
                  <Field label="Father's Name" required>
                    <Inp name="fatherName" value={form.fatherName} onChange={handle} placeholder="Enter father's name" />
                  </Field>
                  <Field label="Email Address" required>
                    <Inp value={cu?.email || ''} disabled className="opacity-60 cursor-not-allowed bg-slate-700/40 text-slate-300" />
                  </Field>
                  <Field label="Mobile Number" required>
                    <div className="flex gap-x-2">
                      <span className="flex items-center px-3 bg-slate-700/40 border border-slate-700 rounded-xl text-sm text-slate-300 font-mono shrink-0">03</span>
                      <Inp name="mobileNumber" value={form.mobileNumber} onChange={handle} placeholder="XXXXXXXXX" maxLength={9} />
                    </div>
                  </Field>
                  <Field label="WhatsApp Number">
                    <div className="flex gap-x-2">
                      <span className="flex items-center px-3 bg-slate-700/40 border border-slate-700 rounded-xl text-sm text-slate-300 font-mono shrink-0">03</span>
                      <Inp name="whatsappNumber" value={form.whatsappNumber} onChange={handle} placeholder="XXXXXXXXX" maxLength={9} />
                    </div>
                  </Field>
                  <Field label="CNIC" required>
                    <Inp name="cnic" value={form.cnic} onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '');
                      if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
                      if (v.length > 13) v = v.slice(0, 13) + '-' + v.slice(13);
                      set('cnic', v.slice(0, 15));
                    }} placeholder="XXXXX-XXXXXXX-X" maxLength={15} />
                  </Field>
                  <Field label="Date of Birth" required>
                    <Inp type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handle} max={new Date().toISOString().split('T')[0]} />
                  </Field>
                  <Field label="Domicile Province" required>
                    <Sel value={form.domicileProvince} onChange={(e) => { set('domicileProvince', e.target.value); set('domicileDistrict', ''); }}>
                      <option value="">Select province</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </Sel>
                  </Field>

                  {/* Gender radio */}
                  <Field label="Gender" required col2>
                    <div className="flex gap-x-3">
                      {['Male', 'Female', 'Transgender'].map((g) => (
                        <label key={g} className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1 justify-center
                          ${form.gender === g ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                            ${form.gender === g ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`}>
                            {form.gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <input type="radio" name="gender" value={g} checked={form.gender === g}
                            onChange={() => set('gender', g)} className="sr-only" />
                          <span className="text-sm font-semibold">{g}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Field label="Religion" required>
                    <Sel value={form.religion} onChange={(e) => set('religion', e.target.value)}>
                      <option value="">Select religion</option>
                      {RELIGIONS.map((r) => <option key={r}>{r}</option>)}
                    </Sel>
                  </Field>
                  <Field label="Marital Status" required>
                    <Sel value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)}>
                      {MARITAL_STATUSES.map((m) => <option key={m}>{m}</option>)}
                    </Sel>
                  </Field>
                  <Field label="Disability Status" required>
                    <Sel value={form.disabilityStatus} onChange={(e) => set('disabilityStatus', e.target.value)}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Sel>
                  </Field>

                  <Field label="Bio / About" col2>
                    <Txt name="bio" value={form.bio} onChange={handle} rows={3}
                      placeholder="Tell us about yourself..." maxLength={500} />
                    <p className="text-xs text-slate-400 text-right mt-1 font-mono">{form.bio.length}/500</p>
                  </Field>

                  <Field label={`Skills (${form.skills.length}/20)`} col2>
                    <div className="flex gap-2 mb-3">
                      <Inp value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                        placeholder="e.g. React, Python..." maxLength={30} />
                      <button type="button" onClick={addSkill}
                        disabled={!skillInput.trim() || form.skills.length >= 20}
                        className="px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5 shrink-0">
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-x-2">
                        {form.skills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
                            {s}
                            <button type="button" onClick={() => set('skills', form.skills.filter((x) => x !== s))}
                              className="hover:text-red-400 transition-colors"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </Field>
                </div>
              </div>
            )}

            {/* ══ ADDRESS ══ */}
            {tab === 'address' && (
              <div style={{ animation: 'fadeUp .3s ease' }}>
                <SectionBanner icon={MapPin} title="Address Information"
                  sub="Your residential address details"
                  grad="from-purple-500 to-pink-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Domicile District" required>
                    <Sel value={form.domicileDistrict} onChange={(e) => set('domicileDistrict', e.target.value)}>
                      <option value="">Select district</option>
                      {districts.map((d) => <option key={d}>{d}</option>)}
                    </Sel>
                    {!form.domicileProvince && (
                      <p className="text-xs text-amber-500 mt-1.5">⚠ Select a province in Personal Info first</p>
                    )}
                  </Field>
                  <Field label="City" required>
                    <Sel value={form.city} onChange={(e) => set('city', e.target.value)}>
                      <option value="">Select city</option>
                      {districts.map((d) => <option key={d}>{d}</option>)}
                    </Sel>
                  </Field>
                  <Field label="Permanent Address" required>
                    <Txt name="permanentAddress" value={form.permanentAddress} onChange={handle} rows={4}
                      placeholder="House #, Street, Area, City..." />
                  </Field>
                  <Field label="Postal Address" required>
                    <Txt name="postalAddress" value={form.postalAddress} onChange={handle} rows={4}
                      placeholder="P.O. Box or full postal address..." />
                  </Field>
                </div>
              </div>
            )}

            {/* ══ EDUCATION ══ */}
            {tab === 'education' && (
              <div style={{ animation: 'fadeUp .3s ease' }}>
                <SectionBanner icon={GraduationCap} title="Educational Qualifications"
                  sub="Add your academic credentials and certifications"
                  grad="from-orange-400 to-red-500" />

                {/* Add form */}
                <div className="bg-slate-700/50 border border-slate-700 rounded-2xl p-4 mb-4">
                  <h3 className="font-bold text-slate-200 mb-4 text-sm">Add New Qualification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Degree Type" required>
                      <Sel value={newQual.degreeType} onChange={(e) => setNewQual((q) => ({ ...q, degreeType: e.target.value }))}>
                        <option value="">Select Degree</option>
                        {DEGREE_TYPES.map((d) => <option key={d}>{d}</option>)}
                      </Sel>
                    </Field>
                    <Field label="Qualification Category (Major Subject)" required>
                      <Sel value={newQual.category} onChange={(e) => setNewQual((q) => ({ ...q, category: e.target.value }))}>
                        <option value="">Select Category</option>
                        {DEGREE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </Sel>
                    </Field>
                    <Field label="Specialization" required>
                      <Inp value={newQual.specialization} placeholder="e.g., Software Engineering"
                        onChange={(e) => setNewQual((q) => ({ ...q, specialization: e.target.value }))} />
                    </Field>
                    <Field label="Institution Name" required>
                      <Inp value={newQual.institution} placeholder="Enter institution name"
                        onChange={(e) => setNewQual((q) => ({ ...q, institution: e.target.value }))} />
                    </Field>
                    <Field label="Year of Completion" required>
                      <Inp type="number" value={newQual.yearOfCompletion} placeholder="2024"
                        min="1970" max={new Date().getFullYear() + 5}
                        onChange={(e) => setNewQual((q) => ({ ...q, yearOfCompletion: e.target.value }))} />
                    </Field>
                    <Field label="Grade / Div / CGPA / Percentage">
                      <Inp value={newQual.grade} placeholder="e.g., A, 1st Div, 3.5, 80%"
                        onChange={(e) => setNewQual((q) => ({ ...q, grade: e.target.value }))} />
                    </Field>
                  </div>
                  <div className="flex justify-end mt-5">
                    <button type="button" onClick={addQual}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 transition-all active:scale-95">
                      <Plus size={15} /> Add Qualification
                    </button>
                  </div>
                </div>

                {/* Table */}
                {form.qualifications.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 bg-slate-800 px-4 py-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      <span className="col-span-3">Degree Level</span>
                      <span className="col-span-2">Category</span>
                      <span className="col-span-3">Institute</span>
                      <span className="col-span-2">Passing Year</span>
                      <span className="col-span-1">Grade</span>
                      <span className="col-span-1" />
                    </div>
                    {form.qualifications.map((q, i) => (
                      <div key={q.id}
                        className={`grid grid-cols-12 gap-2 px-4 py-4 items-center text-sm border-b border-slate-700 last:border-0 ${i % 2 === 0 ? 'bg-slate-800/60' : 'bg-slate-700/50'}`}>
                        <div className="col-span-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">{q.degreeType}</span>
                          {q.specialization && <p className="text-xs text-slate-400 mt-1 truncate">{q.specialization}</p>}
                        </div>
                        <span className="col-span-2 text-slate-600 text-xs">{q.category}</span>
                        <span className="col-span-3 text-slate-700 font-medium text-xs truncate">{q.institution}</span>
                        <span className="col-span-2 text-teal-600 font-bold font-mono">{q.yearOfCompletion}</span>
                        <span className="col-span-1 text-slate-500 text-xs">{q.grade || '—'}</span>
                        <div className="col-span-1 flex justify-end">
                          <button type="button" onClick={() => removeQual(q.id)}
                            className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all">
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen size={24} className="text-orange-200" strokeWidth={1.5} />
                    </div>
                    <p className="text-slate-400 font-medium text-sm">No qualifications added yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">Use the form above to add your academic records</p>
                  </div>
                )}
              </div>
            )}

            {/* ══ PREVIEW ══ */}
            {tab === 'preview' && (
              <div style={{ animation: 'fadeUp .3s ease' }} className="space-y-5">
                {/* Personal */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    <div className="w-3.5 h-3.5 rounded bg-white/30" /><span className="font-bold text-sm">Personal Information</span>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-center mb-5">
                      <div className="relative w-20 h-20 rounded-2xl border-2 border-teal-200 overflow-hidden bg-teal-50 flex items-center justify-center">
                        {form.profileImage
                          ? <img src={form.profileImage} alt="" className="w-full h-full object-cover" />
                          : <User size={32} className="text-teal-300" strokeWidth={1.5} />}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-teal-400 rounded-full border-2 border-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
                      <PF label="Full Name" value={form.name} />
                      <PF label="Father's Name" value={form.fatherName} />
                      <PF label="CNIC" value={form.cnic} />
                      <PF label="Date of Birth" value={form.dateOfBirth} />
                      <PF label="Gender" value={form.gender} />
                      <PF label="Religion" value={form.religion} />
                      <PF label="Marital Status" value={form.maritalStatus} />
                      <PF label="Disability Status" value={form.disabilityStatus} />
                      <PF label="Domicile" value={[form.domicileDistrict, form.domicileProvince].filter(Boolean).join(', ')} />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="w-3.5 h-3.5 rounded bg-white/30" /><span className="font-bold text-sm">Contact Information</span>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <PF label="Email Address" value={cu?.email} />
                    <PF label="WhatsApp Number" value={form.whatsappNumber ? `03${form.whatsappNumber}` : ''} />
                    <PF label="Mobile Number" value={form.mobileNumber ? `03${form.mobileNumber}` : ''} />
                    <PF label="City" value={form.city} />
                    <PF label="Postal Address" value={form.postalAddress} />
                    <PF label="Permanent Address" value={form.permanentAddress} />
                  </div>
                </div>

                {/* Academic */}
                {form.qualifications.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                      <div className="w-3.5 h-3.5 rounded bg-white/30" /><span className="font-bold text-sm">Academic Qualifications</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-800 text-slate-200 text-xs">
                            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Degree Level</th>
                            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Degree Title</th>
                            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Institute</th>
                            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-teal-400">Passing Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.qualifications.map((q, i) => (
                            <tr key={q.id} className={i % 2 === 0 ? 'bg-slate-800/60' : 'bg-slate-700/50'}>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">{q.degreeType}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-700">{q.specialization || q.category}</td>
                              <td className="px-4 py-3 text-slate-600">{q.institution}</td>
                              <td className="px-4 py-3 text-teal-600 font-bold font-mono">{q.yearOfCompletion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <button type="button" onClick={() => setTab('personal')}
                    className="btn-secondary text-sm">
                    ← Back to Edit
                  </button>
                </div>
              </div>
            )}

            {/* ── Footer Save Button ── */}
            {tab !== 'preview' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  {dirty
                    ? <span className="text-amber-500 font-medium">⚠ Unsaved changes</span>
                    : <span className="text-teal-500 font-medium">✓ All changes saved</span>}
                </p>
                <button type="submit" disabled={updateLoading || !dirty}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
                  {updateLoading ? <><Spinner size="sm" /> Saving...</> : <><Save size={15} /> Save Profile</>}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
