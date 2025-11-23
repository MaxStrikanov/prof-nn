import './style.scss';

import changeColor from './public/components/runBtn';
import magnifier from './public/components/magnifier';
import { accordion, changeImg } from './public/components/accordion';

import './public/components/step';
import { mapCity } from './public/components/map';
import openModal from './public/components/modal';
import { autoComplite } from './public/components/autoComplite';

mapCity();
changeColor()

openModal()
autoComplite()
changeImg()
accordion()

if (window.innerWidth > 768) {
  magnifier()
}
