import styles from './ToggleSwitch.module.css';

function ToggleSwitch({ checked, onChange, disabled = false }) {
  const handleChange = (e) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <label className={`${styles.toggleSwitch} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={styles.toggleSlider}></span>
    </label>
  );
}

export default ToggleSwitch;