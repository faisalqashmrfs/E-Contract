import './Form.css';
import focal from './../../assets/image/Group1.png';
import focal2 from './../../assets/image/focalXaa2.png';
import trues from './../../assets/image/lets-icons_done-duotone.png';
import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {checkIfEmailValid, checkIfFormValid} from "../../utils/form.ts";
import {validateField, validateAllFields, prepareSubmitData, createApiConfig} from "../../utils/helpers.ts";

// Animation variants for form elements
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 } 
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto', 
    marginBottom: '10px',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    marginBottom: 0,
    transition: { duration: 0.2 } 
  }
};

const successVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 25 
    } 
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: 0.3 } 
  }
};

// Define the MultiValue component with proper prop validation
const MultiValue = ({ data }) => (
  <div className="tag">
    {data.label}
  </div>
);

// Add prop validation
MultiValue.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired
};

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: '1',
    minHeight: 'unset',
    padding: '3px 40px',
    cursor:'pointer',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    width: '200px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#333',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#FF8500',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#FF8500',
      color: '#333',
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
};

const mandatoryFields = ['id_number', 'full_name', 'phone', 'email', 'approval'];

// Define animation variants for the image upload
const imageContainerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 25 
    } 
  }
};

const imagePreviewVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 20 
    } 
  },
  exit: { 
    scale: 0.8, 
    opacity: 0, 
    transition: { duration: 0.3 } 
  }
};

const Form = () => {
  // Define form state
  const [formData, setFormData] = useState({
    full_name: '',
    id_number: '',
    phone: '',
    email: '',
    approval: false,
    image: null
  });

  // Preview for the uploaded image
  const [imagePreview, setImagePreview] = useState(null);
  
  // For drag and drop functionality
  const [dragActive, setDragActive] = useState(false);
  
  // File input reference
  const fileInputRef = useRef(null);

  // Define validation error messages
  const [errors, setErrors] = useState({
    full_name: '',
    id_number: '',
    phone: '',
    email: '',
    approval: '',
    image: '',
    general: ''
  });
  
  // Define success state
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Track form validity
  const [formIsValid, setFormIsValid] = useState(false);

  // Effect to check if the form is complete
  useEffect(() => {
    // Check if all required fields are present and valid
    const allFieldsValid = checkIfFormValid(
      {
        ...formData,
        approval: formData.approval ? 1 : 0
      }, 
      mandatoryFields
    );
    
    // Check for any validation errors without using current errors state
    const tempErrors = {
      full_name: '',
      id_number: '',
      phone: '',
      email: '',
      approval: '',
      general: ''
    };
    const { formHasErrors } = validateAllFields(formData, tempErrors);
    
    // Update form validity state
    setFormIsValid(allFieldsValid && !formHasErrors);
    
    // Validate email if it exists
    if (formData.email && !checkIfEmailValid(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'البريد الإلكتروني غير صالح'
      }));
    } else if (formData.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  }, [formData]); // No dependency on errors anymore

  // Handle text input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when typing
    setErrors(prev => ({
      ...prev,
      [field]: '',
      general: ''
    }));
    
    // Validate the field
    const fieldError = validateField(field, value);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [field]: fieldError
      }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setFormData(prev => ({
      ...prev,
      approval: event.target.checked
    }));
    setErrors(prev => ({
      ...prev,
      approval: '',
      general: ''
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    handleFile(file);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Process the file
  const handleFile = (file) => {
    if (file && file.type.match('image.*')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        image: '',
        general: ''
      }));
    } else if (file) {
      // If file is not an image
      setErrors(prev => ({
        ...prev,
        image: 'الرجاء تحميل ملف صورة صالح'
      }));
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Remove uploaded image
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Set flag in localStorage
    localStorage.setItem('sended', true);
    
    // Validate all fields
    const { formHasErrors, newErrors } = validateAllFields(formData, errors);
    
    if (formHasErrors) {
      setErrors(newErrors);
      localStorage.removeItem('sended');
      return;
    }

    // Prepare form data for submission with the image
    const submitData = new FormData();
    
    // Add all text fields to the FormData
    const preparedData = prepareSubmitData(formData);
    Object.keys(preparedData).forEach(key => {
      if (key !== 'image') {
        submitData.append(key, preparedData[key]);
      }
    });
    
    // Add the image file if it exists
    // if (formData.image) {
    //   submitData.append('image', formData.image);
    // }

    const config = createApiConfig();

    try {
       await axios.post('http://127.0.0.1:8000/api/contract', submitData, config);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Process API validation errors
        const apiErrors = error.response.data.errors;
        let newFieldErrors = {...errors};
        
        Object.keys(apiErrors).forEach(field => {
          newFieldErrors[field] = apiErrors[field].join(' ');
        });
        
        setErrors(newFieldErrors);
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'حدث خطأ أثناء إرسال البيانات. الرجاء المحاولة مرة أخرى.'
        }));
      }
      localStorage.removeItem('sended');
    }
  };

  // Add this function to the Form component
  const navigateToHome = () => {
    window.location.href = '/';
  };

  return (
    <motion.section 
      className='Form'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.nav 
        className='NavBar'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          delay: 0.2 
        }}
      >
        <img src={focal} alt="Focal X Logo" />
        <h2 style={{ marginLeft: '-25px' }}>Learn .. And Have Fun</h2>
        <img src={focal2} alt="Focal X Logo 2" />
      </motion.nav>
      <motion.main 
        className={showSuccess ? 'blue' : ''}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div 
          className='Content'
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className='ph1'></div>
          <div className='ph2'></div>
        </motion.div>
        <motion.div 
          className='Form-fq'
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={fadeIn}>عقد تدريب الكتروني</motion.h2>
          <motion.p className='p' variants={fadeIn}>
            <span style={{ fontWeight: '600' }}>الطرف الأول</span>: شركة فوكال اكس (نقطة الارتكاز محدودة المسؤولية)  |  سجل تجاري رقم 10062  |   العنوان الرئيسي: سوريا - اللاذقية
          </motion.p>
          <motion.p className='p2' variants={fadeIn}>
            <span style={{ fontWeight: '600' }}>الطرف الثاني</span>: المتدرب صاحب المعلومات التالية:
          </motion.p>
          <motion.form 
            action=""
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* First Row - Image Upload Only */}
            <motion.div className="form-row image-row" variants={fadeIn}>
              <motion.div 
                className="input-container image-upload-container" 
                variants={fadeIn}
                onDragEnter={handleDrag}
              >
                <label className="image-upload-label">صورة الوثيقة (اختياري)</label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                
                <motion.div 
                  className={`image-drop-area ${dragActive ? "drag-active" : ""}`}
                  variants={imageContainerVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onButtonClick}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <AnimatePresence>
                    {!imagePreview ? (
                      <motion.div 
                        className="upload-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                          <rect x="16" y="2" width="6" height="6" rx="1"></rect>
                          <path d="M3 16l5-5c.928-.893 2.072-.893 3 0l4 4"></path>
                          <path d="M14 14l1-1c.928-.893 2.072-.893 3 0l3 3"></path>
                        </svg>
                        <p>انقر أو اسحب وأفلت لإضافة صورة</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="image-preview-container"
                        variants={imagePreviewVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <motion.button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <AnimatePresence>
                  {errors.image && (
                    <motion.p 
                      className="error-message"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {errors.image}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Second Row - All Other Form Fields */}
            <motion.div className="form-row inputs-row" variants={fadeIn}>
              
              <motion.div className="input-container" variants={fadeIn}>
                <input 
                  type="text" 
                  value={formData.id_number} 
                  onChange={(e) => handleInputChange('id_number', e.target.value)} 
                  className='input' 
                  placeholder='الرقم الوطني / جواز السفر' 
                />
                <AnimatePresence>
                  {errors.id_number && (
                    <motion.p 
                      className="error-message"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {errors.id_number}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div className="input-container" variants={fadeIn}>
                <input 
                  type="text" 
                  value={formData.full_name} 
                  onChange={(e) => handleInputChange('full_name', e.target.value)} 
                  className='input' 
                  placeholder='الاسم الكامل باللغة العربية ( الثلاثي )' 
                />
                <AnimatePresence>
                  {errors.full_name && (
                    <motion.p 
                      className="error-message"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {errors.full_name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div className="input-container" variants={fadeIn}>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                  className='input' 
                  placeholder='رقم الهاتف' 
                />
                <AnimatePresence>
                  {errors.phone && (
                    <motion.p 
                      className="error-message"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div className="input-container" variants={fadeIn}>
                <input 
                  type="text" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  className='input' 
                  placeholder='البريد الإلكتروني' 
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      className="error-message"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.form>
          
          <AnimatePresence>
            {errors.general && (
              <motion.p 
                style={{ color: 'red' }}
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {errors.general}
              </motion.p>
            )}
          </AnimatePresence>
          
          <motion.p 
            className='asddvv-sdfsdf-sdf-sdf'
            variants={fadeIn}
          >
            .موافقتك على وثيقة الشروط والأحكام هي بمثابة توقيعك عقد معنا ، يرجى قراءتها بعناية
          </motion.p>
          <motion.section 
            className='Content-if-requer'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className='scroling'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p>التزم بما يلي:</p>
              <p>-  جميع مراحل التدريب (النظري – التفاعلي – العملي – مشروع التخرج) والذي يستمر لمدة أربعة أشهر وذلك اعتباراً من تاريخ 1/8/2024م، ويحق للطرف الأول تمديد هذه المدة لشهر واحد تبعاً للأعطال
                الرسمية والأعياد وعطل المراجعة اللازمة للتدريب التي يقررها الطرف الأول.</p>
              <p>-  حضور الجلسات النظرية في مواعيدها وفقاً لاختصاص تدريبي والمحددة في الملف الرسمي للتدريب.</p>
              <p>-  القيام بالمهام والمسؤوليات (التدريب العملي) التي تحدد من قبل فريق التدريب وفقاً لاختصاص تدريبي وتسليم المهام في الوقت المحدد (من قبل فريق التدريب) بدون تأخير عن الموعد.</p>
              <p>-  التواجد على كافة منصات التواصل الاجتماعي المطلوبة في عملية التدريب.</p>
              <p>- عدم الانخراط في أي نقاش سياسي أو ديني أو عنصري أثناء التدريب لدى الطرف الأول، ويمنع منعاً باتاً أي نوع من أنواع التنمر أو العنصرية أو التحرش الجنسي سواء كان بدني أو لفظي أو الكتروني.</p>
              <p>-  سرية المنهاج التعليمي ويشمل ذلك دونما حصر (تسجيل الجلسات النظرية – الملخصات – الروابط – الأعمال والمهام) وعدم مشاركتها مع أي أطراف خارجية خلال أو بعد انتهاء التدريب.</p>
              <p>-  الأنظمة واللوائح الداخلية والقرارات والتعليمات المعتمدة لدى الطرف الأول.</p>
              <p>- الإقرار بأن حقوق الملكية الفكرية وحقوق المؤلف للأعمال التي قمت بتنفيذها خلال هذا العقد تعود ملكيتها الفكرية للطرف الأول ويشمل ذلك دونما حصر البرمجيات والتطبيقات والأنظمة والدراسات والأبحاث ومواد التدريب وبراءات الاختراع والنماذج والرسوم الصناعة والتصاميم الهندسية وما في حكمها.</p>
              <p>-  معايير السلوك الوظيفي القويم الذي يتفق مع طبيعة تدريبي.</p>
              <p>-  تجنب أي تضارب في المصالح سببه نشاطاتي كعملي الحر أو عملي لدى مؤسسات أخرى.</p>
              <p>-المحافظة وعدم الإفصاح أو الكشف عن أية معلومات خطيّة كانت أو شفهيّة، سريّة كانت بطبيعتها أو محتواها أو بحكم الضوابط والتعليمات الصادرة بشأنها سواء كانت هذه المعلومات تخص الشركة أو أية شركة أخرى دون الحصول على إذن خطي صريح ومسبق بذلك من الإدارة.</p>
              <p>-عدم نقل مضمون أو ملكية أي ملف أو مشروع مملوك للشركة أو تعديله أو ترجمته أو نسخه أو نشره أو تصويره دون الحصول على إذن خطي صريح ومسبق بذلك من الإدارة.</p>
              <p>-المحافظة على الممتلكات المادية والفكرية الخاصة بالطرف الأول، والمحافظة على ملفات وسجلات العمل والمتعاملين بطريقة صحيحة وآمنة والحفاظ على أمن وسلامة وسائل ووسائط الاتصال الإلكترونية وعدم استخدامها لأغراض شخصيّة أو تخرج عن نطاق العمل أو بصورة تمكن أطراف خارجية من الاطلاع غير المصرح به على أنظمة معلومات الشركة.</p>
              <p>-إعادة وتسليم كافة ما في عهدتي من الوثائق والملفات والمواد والأجهزة أو أية ممتلكات أخرى ذات صلة بعملي تخص الشركة سواء كانت سرية أم لا عند انتهاء التدريب، ويتضمن ذلك المواد التي تعود لأطراف أخرى حصلت عليها في سياق القيام بمهام ومشاريع التدريب عند الانتهاء خدمتي أو عند نقلي لمشروع آخر لا يتطلب ابقائها بحوزتي.</p>
              <p>-إزالة كافة المعلومات والبيانات التي تعود بملكيتها إلى الشركة بشكل نهائي وغير قابل للاستعادة من كافة وسائط التخزين سواء كانت في حيازتي أو تحت تصرفي وذلك عند انتهاء التدريب وفقاً للطريقة التي تقرها الإدارة.</p>
              <p>-عدم الاشتراك في عملية أو محادثة أو قرار بهدف تعطيل أو تضييق مصالح المتعاملين أو المتدربين الذين تجمعهم به عداوة سابقة أو مشاعر بُغض أو لأسباب عنصرية أو غيرها.</p>
              <p>- دفع كافة المستحقات المالية في موعدها وكما تم الاتفاق عليه.</p>
              <p>-في حال مخالفتي لأي من التزاماتي المذكورة في هذا العقد، وبعد إرسال الطرف الأول إنذار لي عند المخالفة الأولى، وفي حال الاستمرار بالمخالفة بعد التنبيه، يحق للطرف الأول إنهاء العقد أثناء مدة سريانه شريطة إخطاري بذلك خطياً قبل 5 أيام عمل من تاريخ الإنهاء، ولا يترتب على الطرف الأول أية التزامات مالية أو غيرها عند فسخ العقد.</p>
              <p>- يحق لي الانسحاب من التدريب شريطة إخطار الطرف الأول بذلك قبل 10 أيام عمل، ولا يترتب على الطرف الأول أية التزامات مالية أو غيرها عند انسحاب الطرف الثاني.</p>
              <p>- في حال إخلالي بأي من الالتزامات المشار إليها أعلاه فإنه يحق للطرف الأول أن يتخذ قرار الفصل من التدريب وكافة الإجراءات القانونية السارية في الجمهورية العربية السورية أو في أي دولة يوجد فيها الطرف الأول.</p>
            </motion.div>
            <motion.div 
              className='sm-foter'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
             {!formIsValid && (
               <motion.p 
                 className="form-status-message"
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.3 }}
               >
                 الرجاء إكمال جميع الحقول والموافقة على الشروط للمتابعة
               </motion.p>
             )}
             <motion.button 
               type="button" 
               onClick={handleSubmit}
               whileHover={formIsValid ? { scale: 1.05 } : {}}
               whileTap={formIsValid ? { scale: 0.95 } : {}}
               transition={{ type: 'spring', stiffness: 400, damping: 17 }}
               disabled={!formIsValid}
               className={!formIsValid ? 'button-disabled' : ''}
             >
               إرسال
             </motion.button>
              <p>.أوافق على وثيقة الشروط والأحكام وموافقتي وكتابة اسمي الكامل يُعتبر توقيع على العقد معكم والتزامي بشروط التدريب</p>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={formData.approval} 
                  onChange={handleCheckboxChange} 
                />
                <span className="checkmark"></span>
              </label>
              <AnimatePresence>
                {errors.approval && (
                  <motion.p 
                    className="error-message"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.approval}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>
        </motion.div>
      </motion.main>
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-message"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.img 
                src={trues} 
                alt="Success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >اكتملت إجراءات التسجيل</motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >سيصلك ملف pdf للعقد على تطبيق Whatsapp</motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >خلال 48 ساعة عمل</motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >شكرا لكم</motion.p>
                
                <motion.button
                  className="dismiss-button"
                  onClick={navigateToHome}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  العودة للصفحة الرئيسية
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Form;
