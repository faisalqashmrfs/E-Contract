import './Hero.css';
import focal from './../../assets/image/Group1.png'
import { Link } from 'react-router-dom';
import focal2 from './../../assets/image/focalXaa2.png'
import { motion } from 'framer-motion';

// Define subtle animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.7 } 
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

export default function Hero() {
      return (
            <motion.section 
              className='Hero'
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
                  <motion.nav 
                    className='NavBar'
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                        <motion.img 
                          src={focal} 
                          alt="" 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.h2 
                          style={{ marginLeft: '-25px' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          Learn .. And Have Fun
                        </motion.h2>
                        <motion.img 
                          src={focal2} 
                          alt="" 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                  </motion.nav>
                  <motion.div 
                    className='Content'
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                        <div className='ph1'></div>
                        <div className='ph2'></div>
                  </motion.div>
                  <motion.div 
                    className='ppp'
                    variants={staggerChildren}
                  >
                        <motion.h1 variants={slideUp}>.اكتب فصلاً جديداً في قصة نجاحك</motion.h1>
                        <motion.p 
                          className='descrip'
                          variants={slideUp}
                        >
                              ،أكاديمية التدريب التابعة لشركة فوكال اكس .X academy مرحباً بكم في
                              <br />
                                نحن هنا نؤمن بكم وبقدراتكم، أنتم لستم فقط متدربين
                              <span>
                                    .بل شركاء نجاح مستقبلين
                              </span>
                        </motion.p>
                        <motion.p 
                          className='descrip1'
                          variants={slideUp}
                        >
                              .X academy مرحباً بكم في
                              <br />
                              ،أكاديمية التدريب التابعة لشركة فوكال اكس
                              <br />
                              نحن هنا نؤمن بكم وبقدراتكم، أنتم لستم فقط متدربين
                              <span>
                                    .بل شركاء نجاح مستقبلين
                              </span>
                        </motion.p>
                        <motion.button
                          variants={slideUp}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 15 
                          }}
                        >
                              <Link style={{zIndex:'123123'}} to={'/Form'}>
                                    توقيع العقد الإلكتروني
                              </Link>
                        </motion.button>

                        <motion.div 
                          className='counts'
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.7, 
                            ease: "easeOut" 
                          }}
                        >
                              <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                              >
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.8 }}
                                    >5+</motion.p>
                                    <span>دفعات تدريب</span>
                              </motion.div>
                              <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                              >
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.9 }}
                                    >24+</motion.p>
                                    <span>مدرب</span>
                              </motion.div>
                              <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                              >
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 1.0 }}
                                    >3000+</motion.p>
                                    <span>متدرب</span>
                              </motion.div>
                        </motion.div>
                  </motion.div>
            </motion.section>
      )
}