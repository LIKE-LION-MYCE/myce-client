import styles from './PlatformAdminInfoBox.module.css';

function PlatformAdminInfoBox() {
  return (
    <div className={styles.expoInfoBox}>
      <img
        src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FGHYFr%2FbtrsSwcSDQV%2FAAAAAAAAAAAAAAAAAAAAACsokQ_8c_dqM6Kbqu-6kkVqje4nKRyIWIW_otxQsT8O%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1753973999%26allow_ip%3D%26allow_referer%3D%26signature%3D9iGlW5I43DSL4AvP5nc7bWTC3JA%253D"
        alt="Expo"
        className={styles.expoImage}
      />
      <span className={styles.expoName}>부산 엑스포</span>
    </div>
  );
}

export default PlatformAdminInfoBox;
