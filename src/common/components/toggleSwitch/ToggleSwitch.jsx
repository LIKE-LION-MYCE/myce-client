import styles from './ToggleSwitch.module.css';

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className={styles.toggleSwitch}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.toggleSlider}></span>
    </label>
  );
}

export default ToggleSwitch;