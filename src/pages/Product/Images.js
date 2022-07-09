import React, {useState,useRef} from "react";
import styles from './Images.module.scss';
import { useConfig } from 'context/ConfigContext';
import { sleep } from "services/functions";

export default function Images({pid=0, img=[], className=""}){
    const [selected, setSelected] = useState(0);
    const imgNext = useRef();
    const card = useRef();
    const gallery = useRef();
    const url = useConfig().img_url + 'pimg.php?i=';
    const transitionTime = 600;

    const changeTo = async (i,e) =>{
        if(selected==i) return;
        while(window.images_in_trasition) await sleep(100);
        window.images_in_trasition = true;
        gallery.current.querySelector('.'+styles.selected).classList.remove(styles.selected);
        e.target.closest('div').classList.add(styles.selected);
        imgNext.current.setAttribute('src',url+img[i]);
        card.current.style.transition = 'transform '+transitionTime+'ms';
        if(i>selected) card.current.style.transform = 'rotateY(180deg)';
        else card.current.style.transform = 'rotateY(-180deg)';
        await sleep(transitionTime);
        card.current.style.removeProperty('transition');
        card.current.style.removeProperty('transform');
        setSelected(i);
    }

    const $images = [];
    for(let i in img){
        if(i>6) break;
        $images.push(
            <div className={styles.image + (selected==i ? ' '+styles.selected : '')} key={i} onClick={(e)=>{ changeTo(i,e); }}>
                <img src={url+img[i]}/>
            </div>
        );
    }

    window.images_in_trasition = false;

    return (
        <div className={className}>
            <div className={styles.images}>
                <div className={styles.images_gallery} ref={gallery}>
                    { $images }
                </div>
                <div className={styles.currentImage + " " + styles.flip_card}>
                    <div className={styles.flip_card_inner} ref={card}>
                        <div className={styles.flip_card_front}>
                            <img src={url+img[selected]}/>
                        </div>
                        <div className={styles.flip_card_back}>
                            <img ref={imgNext}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}