import AsyncStorage from '@react-native-async-storage/async-storage';

class Helpers {
    constructor() { }

    getSelectedLanguage = async () => {
        try {
            const selectedLanguageData = await AsyncStorage.getItem('selectedLanguage');
            if (selectedLanguageData) {
                const transformedData = JSON.parse(selectedLanguageData);
                let languageId = transformedData.lang;
                console.log('async languageId ', languageId)
            }
        } catch (e) {
            console.log('e', e)
        }
    }
}
export default Helpers;