import './Form.css'
import focal from './../../assets/image/Group1.png'
import test from './../../assets/image/Vector222.png'
import { useState } from 'react';

export default function Form() {

  const [fileName, setFileName] = useState('ارفق صورة وجه أمامي لهويتك / جواز سفرك');
  const [File, setFile] = useState();
  const [name, setname] = useState();
  const [num, setnum] = useState();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName('تم تحميل الصورة بنجاح');
      setFile(event.target.files[0]);
    }
  };

  const Handel = () => {
    let body =
    {
      File: File,
      name: name,
      num: num
    }
    console.log(body);

  }

  const HandelName = (event) => {
    setname(event.target.value)
  }

  const HandelNum = (event) => {
    setnum(event.target.value)
  }

  return (
    <section className='Form'>
      <nav className='NavBar'>
        <img src={focal} alt="" />
        <h2>Learn .. And Have Fun</h2>
      </nav>
      <div className='Content'>
        <div className='ph1'></div>
        <div className='ph2'></div>
      </div>
      <div className='Form-fq'>
        <h2>عقد الكتروني</h2>
        <p className='p'>موافقتك على وثيقة الشروط والأحكام هي بمثابة توقيعك عقد معنا، يرجى قراءتها بعناية.</p>
        <form action="">
          <div className="custom-file-upload">
            <label htmlFor="file-upload" className="custom-file-label">
              <img src={test} alt="" />{fileName}
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} />
          </div>
          <input type="text" value={num} onChange={HandelNum} className='input' placeholder='الرقم الوطني / جواز السفر' />
          <input type="text" value={name} onChange={HandelName} className='input' placeholder='الاسم الكامل ( الثلاثي )' />
        </form>
        <section className='Content-if-requer'>
          <div className='scroling'>
            <p>- ألتزم جميع مراحل التدريب (النظري – التفاعلي – العملي – مشروع التخرج) والذي يستمر لمدة أربعة أشهر وذلك اعتباراً من تاريخ 1/8/2024م، ويحق للطرف الأول تمديد هذه المدة لشهر واحد تبعاً للأعطال
              الرسمية والأعياد وعطل المراجعة اللازمة للتدريب التي يقررها الطرف الأول.</p>
            <p>- ألتزم حضور الجلسات النظرية في مواعيدها وفقاً لاختصاص تدريبي والمحددة في الملف الرسمي للتدريب.</p>
            <p>- ألتزم القيام بالمهام والمسؤوليات (التدريب العملي) التي تحدد من قبل فريق التدريب وفقاً لاختصاص تدريبي وتسليم المهام في الوقت المحدد (من قبل فريق التدريب) بدون تأخير عن الموعد.</p>
            <p>- ألتزم التواجد على كافة منصات التواصل الاجتماعي المطلوبة في عملية التدريب.</p>
            <p>- ألتزم سرية المنهاج التعليمي ويشمل ذلك دونما حصر (تسجيل الجلسات النظرية – الملخصات – الروابط –   الأعمال والمهام) وعدم مشاركتها مع أي أطراف خارجية خلال أو بعد انتهاء التدريب.</p>
            <p>- ألتزم عدم تخزين أي من الجلسات النظرية المسجلة خلال أو بعد انتهاء التدريب.</p>
            <p>- ألتزم الأنظمة واللوائح الداخلية والقرارات والتعليمات المعتمدة لدى الطرف الأول.</p>
            <p>- ألتزم معايير السلوك الوظيفي القويم الذي يتفق مع طبيعة تدريبي.</p>
            <p>- ألتزم تدريب زملائي الأضعف وذلك بنقل المعلومات والخبرات التي اكتسبتها إلى المتدربين المتواجدين معي في الفريق بكل أمانة وجدية.</p>
            <p>- ألتزم عدم الانخراط في أي نقاش سياسي أو ديني أو عنصري أثناء التدريب لدى الطرف الأول.</p>
            <p>- ألتزم تجنب أي تضارب في المصالح سببه نشاطاتي كعملي الحر أو عملي لدى مؤسسات أخرى.</p>
            <p>- ألتزم دفع كافة المستحقات المالية في موعدها وكما تم الاتفاق عليه.</p>
          </div>
          <div className='sm-foter'>
            <button onClick={Handel}>متابعة</button>
            <p>أوافق على وثيقة الشروط والأحكام وموافقتي وكتابة اسمي الكامل يُعتبر توقيع على العقد معكم والتزامي بشروط التدريب.</p>
            <label class="checkbox-container">
              <input type="checkbox" />
              <span class="checkmark"></span>
            </label>
          </div>
        </section>
      </div>
    </section>
  )
}
