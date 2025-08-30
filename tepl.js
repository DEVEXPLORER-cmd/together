import React, { useState, useCallback } from 'react';

// --- DATA ---
// In a real-world application, this data would be fetched from a backend API.
const indianStatesAndCities = {
  "Andaman and Nicobar Islands": ["Port Blair", "Garacharma", "Bambooflat"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Solan", "Dharamshala", "Baddi", "Mandi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City"],
  "Karnataka": ["Bengaluru", "Hubballi-Dharwad", "Mysuru", "Mangaluru", "Belagavi", "Davanagere", "Ballari"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur"],
  "Puducherry": ["Puducherry", "Karaikal"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah"]
};
const indianBanks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Punjab National Bank", "Axis Bank", "Bank of Baroda", "Canara Bank", "Union Bank of India"];
const foreignBanks = ["Citibank", "HSBC", "Standard Chartered", "Deutsche Bank", "DBS Bank", "American Express"];
const eventCategories = { "Corporate Events": ["Conferences", "Seminars", "Product Launches", "Award Ceremonies", "Gala Dinners"], "Marketing & Promotions": ["Roadshows", "Brand Activations", "Mall Promotions"], "MICE": ["Meetings", "Incentives", "Conventions", "Exhibitions"], "Social & Private Events": ["Weddings", "Private Parties", "Anniversaries"] };
const suitableForServices = ["Venue Management", "Audio-Visual Production", "Catering Services", "Logistics & Transportation", "Artist Management", "Set Design & Fabrication"];
const countryPhoneCodes = { "+91": { country: "India", digits: 10 }, "+1": { country: "USA/Canada", digits: 10 }, "+44": { country: "UK", digits: 10 }, "+61": { country: "Australia", digits: 9 } };

// --- Reusable UI Components ---
const InputField = React.memo(({ label, id, required, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input id={id} name={id} required={required} {...props} className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
));

const SelectField = React.memo(({ label, id, required, children, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <select id={id} name={id} required={required} {...props} className={`block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}>{children}</select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
));

const FileUpload = React.memo(({ label, required, onFileSelect, selectedFile, id }) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(e.type === "dragenter" || e.type === "dragover"); }, []);
    const handleDrop = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files?.[0]) { onFileSelect(id, e.dataTransfer.files[0]); } }, [onFileSelect, id]);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <label onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                <input type="file" className="hidden" onChange={(e) => onFileSelect(id, e.target.files[0])} accept=".pdf,.png,.jpg,.jpeg"/>
                <p className="text-indigo-600 font-semibold text-sm">Upload a file or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                {selectedFile && <p className="text-xs text-green-600 mt-2 font-semibold truncate" title={selectedFile.name}>Selected: {selectedFile.name}</p>}
            </label>
        </div>
    );
});

// --- Form Sections/Steps ---
const Step1_BasicInfo = ({ data, setData, errors }) => (
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <InputField label="Company Name" id="companyName" required value={data.companyName} onChange={setData} />
        <InputField label="Contact Person" id="contactPerson" required value={data.contactPerson} onChange={setData} />
        <InputField label="Email Address" id="email" type="email" required value={data.email} onChange={setData} error={errors.email} placeholder="name@example.com"/>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
            <div className="flex">
                <select name="phoneCode" value={data.phoneCode} onChange={setData} className="px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.keys(countryPhoneCodes).map(code => <option key={code} value={code}>{code}</option>)}
                </select>
                <input id="phone" name="phone" type="tel" required value={data.phone} onChange={setData} className={`block w-full px-3 py-2 border rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${errors.phone ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <SelectField label="State" id="state" required value={data.state} onChange={setData}>
            <option value="">Select State</option>
            {Object.keys(indianStatesAndCities).sort().map(state => <option key={state} value={state}>{state}</option>)}
        </SelectField>
        <SelectField label="City" id="city" required value={data.city} onChange={setData} disabled={!data.state}>
            <option value="">Select City</option>
            {(indianStatesAndCities[data.state] || []).sort().map(city => <option key={city} value={city}>{city}</option>)}
        </SelectField>
        <InputField label="Pincode" id="pincode" required value={data.pincode} onChange={setData} error={errors.pincode} />
        <InputField label="Complete Address" id="address" required value={data.address} onChange={setData} />
    </div>
);

const Step2_LegalFinancial = ({ data, setData, errors }) => (
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <SelectField label="Legal Entity Type" id="legalEntityType" required value={data.legalEntityType} onChange={setData}><option value="">Select Type</option><option>Partnership</option><option>Proprietorship</option><option>Private Limited Company</option><option>LLP</option></SelectField>
        <InputField label="PAN (Permanent Account Number)" id="pan" required value={data.pan} onChange={setData} error={errors.pan} placeholder="ABCDE1234F"/>
        <InputField label="GSTIN (Goods and Services Tax ID)" id="gstin" value={data.gstin} onChange={setData} error={errors.gstin} placeholder="Optional, e.g., 22AAAAA0000A1Z5"/>
        <SelectField label="Bank Type" id="bankType" value={data.bankType} onChange={setData}><option>Indian</option><option>Foreign</option></SelectField>
        <SelectField label="Bank Name" id="bankName" required value={data.bankName} onChange={setData}><option value="">Select Bank</option>{(data.bankType === 'Indian' ? indianBanks : foreignBanks).sort().map(b => <option key={b} value={b}>{b}</option>)}</SelectField>
        <InputField label="Bank Account Number" id="accountNumber" required value={data.accountNumber} onChange={setData} />
        <InputField label="IFSC Code" id="ifsc" required value={data.ifsc} onChange={setData} error={errors.ifsc} placeholder="ABCD0123456"/>
        <SelectField label="Are you a registered MSME?" id="isMsme" value={data.isMsme} onChange={setData}><option>No</option><option>Yes</option></SelectField>
        {data.isMsme === 'Yes' && <InputField label="MSME Registration Number" id="msmeNumber" required value={data.msmeNumber} onChange={setData} />}
        <div className="md:col-span-2"><SelectField label="Any prior business relationship with Together Events or its employees?" id="priorRelationship" value={data.priorRelationship} onChange={setData}><option>No</option><option>Yes</option></SelectField></div>
    </div>
);

const Step3_Capabilities = ({ data, setData }) => (
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <SelectField label="Primary Service Category" id="category" required value={data.category} onChange={setData}><option value="">Select Category</option>{Object.keys(eventCategories).map(c => <option key={c} value={c}>{c}</option>)}</SelectField>
        <SelectField label="Sub-Category / Specialization" id="subCategory" required value={data.subCategory} onChange={setData} disabled={!data.category}><option value="">Select Sub-Category</option>{(eventCategories[data.category] || []).map(sc => <option key={sc} value={sc}>{sc}</option>)}</SelectField>
        <div className="md:col-span-2"><SelectField label="Suitable for (Services Offered)" id="suitableFor" required value={data.suitableFor} onChange={setData}><option value="">Select Service Type</option>{suitableForServices.map(s => <option key={s} value={s}>{s}</option>)}</SelectField></div>
        <div className="md:col-span-2"><label htmlFor="opCapabilities" className="block text-sm font-medium text-gray-700 mb-1">Describe your Operational Capabilities</label><textarea id="opCapabilities" name="opCapabilities" rows="4" value={data.opCapabilities} onChange={setData} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"></textarea></div>
    </div>
);

const Step4_Compliance = ({ data, setData }) => (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <div className="text-center">
            <p className="text-sm text-gray-800">Please download and review the following documents before proceeding.</p>
            <div className="flex justify-center space-x-6 mt-3">
                <a href="/Draft_Supplier_Agreement.docx" download className="text-indigo-600 font-semibold hover:underline">Download Supplier Agreement</a>
                <a href="/Disciplinary_Policy_for_Suppliers.pdf" download className="text-indigo-600 font-semibold hover:underline">Download Disciplinary Policy</a>
            </div>
        </div>
        <div className="flex items-start"><input type="checkbox" id="agreeToConduct" name="agreeToConduct" checked={data.agreeToConduct} onChange={setData} required className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1 shrink-0"/><label htmlFor="agreeToConduct" className="ml-3 text-sm text-gray-600">I acknowledge I have read, understood, and agree to comply with Together Events' Code of Conduct and all applicable Indian laws, including anti-bribery/corruption policies.</label></div>
        <div className="flex items-start"><input type="checkbox" id="agreeToDataProtection" name="agreeToDataProtection" checked={data.agreeToDataProtection} onChange={setData} required className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1 shrink-0"/><label htmlFor="agreeToDataProtection" className="ml-3 text-sm text-gray-600">I agree to adhere to Indian data protection laws (IT Act, 2000; DPDP Act, 2023). I will notify Together Events within 24 hours of any data breach and cooperate with security audits.</label></div>
    </div>
);

const Step5_Uploads = ({ data, handleFileChange }) => (
    <div className="grid md:grid-cols-2 gap-6">
        <FileUpload label="PAN Card" id="panDoc" required onFileSelect={handleFileChange} selectedFile={data.panDoc} />
        <FileUpload label="GST Certificate" id="gstDoc" onFileSelect={handleFileChange} selectedFile={data.gstDoc} />
        {data.isMsme === 'Yes' && <FileUpload label="MSME Certificate" id="msmeCert" required onFileSelect={handleFileChange} selectedFile={data.msmeCert} />}
        <FileUpload label="Cancelled Cheque" id="cancelledCheque" required onFileSelect={handleFileChange} selectedFile={data.cancelledCheque} />
        <FileUpload label="Company Proof (e.g., Certificate of Incorporation)" id="companyProof" required onFileSelect={handleFileChange} selectedFile={data.companyProof} />
        <FileUpload label="Signed Supplier Agreement" id="agreementDoc" required onFileSelect={handleFileChange} selectedFile={data.agreementDoc} />
        <FileUpload label="Signed Compliance Policy" id="policyDoc" required onFileSelect={handleFileChange} selectedFile={data.policyDoc} />
    </div>
);

// --- Main App Component ---
function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '', contactPerson: '', email: '', phoneCode: '+91', phone: '', state: '', city: '', pincode: '', address: '',
        legalEntityType: '', pan: '', gstin: '', bankType: 'Indian', bankName: '', accountNumber: '', ifsc: '',
        isMsme: 'No', msmeNumber: '', priorRelationship: 'No', opCapabilities: '',
        category: '', subCategory: '', suitableFor: '',
        agreeToConduct: false, agreeToDataProtection: false,
        panDoc: null, gstDoc: null, msmeCert: null, cancelledCheque: null, companyProof: null, agreementDoc: null, policyDoc: null,
    });
    const [errors, setErrors] = useState({});

    const steps = ["Basic Info", "Legal & Financial", "Capabilities", "Compliance", "Uploads"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        
        // Auto-uppercase for PAN and IFSC
        let processedValue = val;
        if (name === 'pan' || name === 'ifsc') {
            processedValue = val.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
        
        if (name === "state") {
            setFormData(prev => ({...prev, city: ''}));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    
    const handleFileChange = (name, file) => {
        if (file && file.size > 10 * 1024 * 1024) { // 10MB size limit
            alert(`File ${file.name} is too large. Please upload files under 10MB.`);
            return;
        }
        setFormData(prev => ({ ...prev, [name]: file }));
    };

    const validateStep = () => {
        const newErrors = {};
        const requiredFields = {
            1: ['companyName', 'contactPerson', 'email', 'phone', 'state', 'city', 'pincode', 'address'],
            2: ['legalEntityType', 'pan', 'bankName', 'accountNumber', 'ifsc', 'isMsme', 'priorRelationship'],
            3: ['category', 'subCategory', 'suitableFor', 'opCapabilities'],
            4: ['agreeToConduct', 'agreeToDataProtection'],
            5: ['panDoc', 'cancelledCheque', 'companyProof', 'agreementDoc', 'policyDoc']
        };

        (requiredFields[currentStep] || []).forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required.';
            }
        });

        if (currentStep === 1) {
            if (formData.email && !formData.email.endsWith('.com')) newErrors.email = "Email address must end with .com";
            const phoneRule = countryPhoneCodes[formData.phoneCode];
            if (formData.phone && !new RegExp(`^\\d{${phoneRule.digits}}$`).test(formData.phone)) newErrors.phone = `${phoneRule.country} phone numbers must be ${phoneRule.digits} digits.`;
            if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Indian Pincode must be 6 digits.";
        }
        if (currentStep === 2) {
            if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = "Invalid PAN format. Should be ABCDE1234F.";
            if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) newErrors.gstin = "Invalid GSTIN format.";
            if (formData.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) newErrors.ifsc = "Invalid IFSC format. Should be ABCD0123456.";
            if (formData.isMsme === 'Yes' && !formData.msmeNumber) newErrors.msmeNumber = "MSME number is required.";
        }
         if (currentStep === 5 && formData.isMsme === 'Yes' && !formData.msmeCert) {
            newErrors.msmeCert = "MSME Certificate is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => { if (validateStep()) setCurrentStep(prev => Math.min(prev + 1, steps.length + 1)); };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep()) {
            console.log("Final Form Data:", formData);
            // Here you would typically send the formData to a server
            // For file uploads, you would use FormData()
            alert("Form submitted successfully! Check the console for the data.");
            nextStep();
        } else {
            alert("Please correct the errors before submitting.");
        }
    };
    
    const Stepper = ({ currentStep, steps }) => (
        <div className="flex items-center justify-center mb-10 w-full">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center text-center w-24">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${currentStep > index + 1 ? 'bg-green-500' : currentStep === index + 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                            {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        <p className={`mt-2 text-xs font-semibold transition-colors duration-300 ${currentStep >= index + 1 ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-auto border-t-2 transition-all duration-500 ease-in-out mx-2 ${currentStep > index + 1 ? 'border-green-500' : 'border-gray-300'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1_BasicInfo data={formData} setData={handleChange} errors={errors} />;
            case 2: return <Step2_LegalFinancial data={formData} setData={handleChange} errors={errors} />;
            case 3: return <Step3_Capabilities data={formData} setData={handleChange} />;
            case 4: return <Step4_Compliance data={formData} setData={handleChange} />;
            case 5: return <Step5_Uploads data={formData} handleFileChange={handleFileChange} />;
            case 6: return (
                <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
                    <p className="text-gray-600 mt-2">Your information has been submitted for review.</p>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-4xl">
                <header className="text-center mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">Supplier Onboarding Portal</h1>
                    <p className="text-sm text-gray-500">Together Events Private Limited</p>
                </header>
                
                <Stepper currentStep={currentStep} steps={steps} />
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="min-h-[350px] py-4">
                       {renderStep()}
                    </div>
                   
                    {currentStep <= steps.length && (
                         <div className="mt-8 pt-5 border-t">
                            <div className="flex justify-between">
                                <button type="button" onClick={prevStep} disabled={currentStep === 1} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                {currentStep < steps.length && 
                                    <button type="button" onClick={nextStep} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
                                        Next
                                    </button>
                                }
                                {currentStep === steps.length && 
                                    <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700">
                                        Submit Form
                                    </button>
                                }
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default App;
