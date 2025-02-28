export  const getDataTable = async () => {
  try {
    const response = await fetch('http://localhost:3100/tests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // дополнительный обработчик пользовательского сценария 
    }

    const result = await response.json();
    return result
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
};

export const getDataSite = async () => {
  try {
    const response = await fetch('http://localhost:3100/sites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // дополнительный обработчик пользовательского сценария 
    }

    const result = await response.json();
    return result
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
};