import React, { useEffect } from 'react'
import NavBar from '../common/NavBar';
import { Link } from "react-router-dom";

function FAQ() {
    // useEffect(() => {
    //     let usrI = [
    //         {
    //             itemId: 1,
    //             quantity: 2
    //         },
    //         {
    //             itemId: 2,
    //             quantity: 4
    //         },
    //         {
    //             itemId: 3,
    //             quantity: 6
    //         }
    //     ];
    //     sessionStorage.setItem('userOrder', JSON.stringify(usrI))
    // });
  return (
    <div className='pubPage'>
        <div className='navBar'>
            <NavBar/>
        </div>
        <div className='pubContent'>
            <table className='faqTable'>
                <tr>
                    <td className='question'>Do you guarantee your seeds will grow?</td>
                </tr>
                <tr>
                    <td className='answer'>Yes. If you have an issue with any seeds that just won't pop, let me know and I'll replace each seed, one time, free of charge.</td>
                </tr>
                <tr>
                    <td className='question'>I noticed that you don't have any of the typical strains I'm familiar with. Why is that?</td>
                </tr>
                <tr>
                    <td className='answer'>
                    I've found that cannabis strains don't frequently look, smell, taste, or have the same effect when they are bought at different times or from different places. Upon looking into it, I found that science agrees. <a href='https://jcannabisresearch.biomedcentral.com/articles/10.1186/s42238-019-0001-1' target='blank'>See here</a>, <a href='https://www.dal.ca/news/2022/01/07/cannabis-labels-study-indica-sativa.html' target='blank'>and here</a>, <a href='https://www.marijuanamoment.net/marijuana-strain-labels-often-mislead-consumers-study-of-nearly-90000-samples-shows/' target='blank'>and here.</a> I realized that there must be a better way, and I set upon focusing on finding plants that I really like and not only breeding them, but also closely tracking both their maternal and paternal lineage. This way, when you find a plant that you really enjoy and later want seeds to grow something similar, I can find something with the same lineage from seeds that have shown that they display consistent characteristics.
                    </td>
                </tr>
                <tr>
                    <td className='question'>I don't see any feminized seeds. Why not?</td>
                </tr>
                <tr>
                    <td className='answer'>I have feminized seeds in the past with success, and you may see them available from time to time. If you do get any males that you don't want, I will replace the seeds at no charge to you. If any of those are males, I'll continue to replace them until you have a female for each seed that you initially ordered. Sometimes, I just include a few extra seeds with your order to help with this.</td>
                </tr>
                <tr>
                    <td className='question'>How long have you been growing cannabis?</td>
                </tr>
                <tr>
                    <td className='answer'>I honestly don't remember when I first started growing, but I can tell you it's been a long time. I've been growing cannabis for seeds for about 20 years. In some circles, I'm just known as the seed guy.</td>
                </tr>
                <tr>
                    <td className='question'>What is Boutique Seeds about?</td>
                </tr>
                <tr>
                    <td className='answer'>I just really enjoy growing weed and I want others to be able to do the same. I produce the cannabis seed version of small-batch, artisinal microbrew. Now that the law allows me to grow larger crops than before, I have been able to expand to the point that I've even sold my seeds to cannabis farms in 3 states. Read more on our <Link to='about'>about page</Link>.</td>
                </tr>
                <tr>
                    <td className='question'>How quickly do orders ship and how much is shipping?</td>
                </tr>
                <tr>
                    <td className='answer'>Typically, orders ship within 3 business days after you place and pay for the order, but I guarantee that they will ship within 5 business days after. If you are in a rush, expedited shipping is also available. The shipping cost depends on how much you buy and if you've set up an account. If your order is over $50 and you have an account with me, then shipping is free. Business pricing is structured differently. If you are interested in business or bulk pricing, please <Link to='/contact'>contact</Link> me.</td>
                </tr>
                <tr>
                    <td className='question'>Are seeds legal to buy and possess?</td>
                </tr>
                <tr>
                    <td className='answer'>I don't know about every state, but here in New Mexico they are.</td>
                </tr>
                <tr>
                    <td className='question'>Do you have to be 18 to buy seeds.</td>
                </tr>
                <tr>
                    <td className='answer'>Legally, no. But, if you want to buy from me, yes.</td>
                </tr>
                <tr>
                    <td className='question'>Do you ever trade seeds?</td>
                </tr>
                <tr>
                    <td className='answer'>I have a few times. If you have seeds that you're interested in trading, please <Link to='/contact'>contact</Link> me.</td>
                </tr>
                <tr>
                    <td className='question'>Why do I have to enter my personal information such as my address, to create an account?</td>
                </tr>
                <tr>
                    <td className='answer'>I only require that type of information in case there's an issue with an order. That way I have an idea of where to send it or how to reach you. I do NOT verify any of the information on your account, so if you don't want me to have your information and you choose to register with a fake name or address and then forget to change it when you place your order so your seeds get sent to someone else, that's 100% on you.</td>
                </tr>
                <tr>
                    <td className='question'>How do you accept payment?</td>
                </tr>
                <tr>
                    <td className='answer'>You can pay with your PayPal account or with a credit or debit card, also processed through PayPal.</td>
                </tr>
                <tr>
                    <td className='question'>Does this site use cookies?</td>
                </tr>
                <tr>
                    <td className='answer'>No.</td>
                </tr>
                <tr>
                    <td className='question'>Do you grow indoors or outdoors?</td>
                </tr>
                <tr>
                    <td className='answer'>Most of my plants go into raised beds outside, but depending on the time of year and other factors, I grow inside as well. I prefer outside and tend to have the best luck that way. I deliberately breed plants that are heat-tolerant and grow well outside in the Southwest heat.</td>
                </tr>
            </table>
        </div>
    </div>
  )
}

export default FAQ