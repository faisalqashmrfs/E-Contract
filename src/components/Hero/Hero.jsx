import './Hero.css';
import focal from './../../assets/image/Group1.png'
import { Link } from 'react-router-dom';

export default function Hero() {
      return (
            <section className='Hero'>
                  <nav className='NavBar'>
                        <img src={focal} alt="" />
                        <h2>Learn .. And Have Fun</h2>
                  </nav>
                  <div className='Content'>
                        <div className='ph1'></div>
                        <div className='ph2'></div>
                  </div>
                  <div className='ppp'>
                        <h1>. اكتب فصلاً جديدًا في قصة نجاحك</h1>
                        <p className='descrip'>
                              ،أكاديمية التدريب التابعة لشركة فوكال اكس .x academy مرحباً بكم في
                              <br />
                              نحن هنا نؤمن بكم وبقدراتكم، أنتم لستم فقط
                              <span>
                                    .بل شركاء نجاح مستقبلين
                              </span>
                        </p>
                        <p className='descrip1'>
                              .x academy مرحباً بكم في
                              <br />
                              ،أكاديمية التدريب التابعة لشركة فوكال اكس
                              <br />
                              نحن هنا نؤمن بكم وبقدراتكم، أنتم لستم فقط
                              <span>
                                    .بل شركاء نجاح مستقبلين
                              </span>
                        </p>
                        <button>
                              <Link to={'/Form'}>
                                    توقيع العقد الإلكتروني
                              </Link>
                        </button>

                        <div className='counts'>
                              <div>
                                    <p>5+</p>
                                    <span>دفعات تدريب</span>
                              </div>
                              <div>
                                    <p>24+</p>
                                    <span>مدرب</span>
                              </div>
                              <div>
                                    <p>1000+</p>
                                    <span>متدرب</span>
                              </div>
                        </div>
                  </div>
            </section>
      )
}