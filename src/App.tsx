//import 'assets/Bootstrap/bootstrap.scss';
import 'assets/style.scss';
import React from 'react';
import Header from 'components/Header/Header';
import Body from 'components/Body/Body';
import {ConfigProvider,useConfig} from './context/ConfigContext';
import {LanguageProvider,useLanguage} from './context/LanguageContext';
import {UserProvider} from './context/UserContext';

function Config(){
	const {isLoading} = useConfig();
	return isLoading ? (<></>) : (
		<LanguageProvider>
			<Language/>
		</LanguageProvider>
	);
}


function Language(){
	const {isLoading} = useLanguage();
	return isLoading===true ? (<></>) : (
		<UserProvider>
			<User/>
		</UserProvider>
	);
}


function User(){
	return (
		<div className="App">
			<Header user="1"/>
			<Body/>
		</div>
	);
}


export default ()=>{
	return (
		<ConfigProvider>
			<Config/>
		</ConfigProvider>
	);
}