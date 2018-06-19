package cordova.device.extended.information;

import android.os.Environment;
import android.os.StatFs;

import java.io.File;
import java.text.DecimalFormat;
import java.util.TimeZone;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.provider.Settings;

public class ExtendedDevice extends CordovaPlugin {
    public static final String TAG = "ExtendedDevice";

    /**
     * Constructor.
     */
    public ExtendedDevice() {
    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("getExtendedDeviceInfo".equals(action)) {
            JSONObject r = new JSONObject();
            r.put("memory", this.getMemorySize());
            r.put("cpumhz", this.getCpuMhz());
            r.put("totalstorage", this.getTotalSystemStorage());
            r.put("freestorage", this.getFreeSystemStorage());
            
            callbackContext.success(r);
        }
        else {
            return false;
        }
        return true;
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------

    public String getTotalSystemStorage(){
        StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
        long bytesAvailable = (long)stat.getBlockSize() * (long)stat.getBlockCount() / 1048576;
        return Long.toString(bytesAvailable);
    }

    public long getFreeSystemStorage(){
      File path = Environment.getExternalStorageDirectory();
      StatFs stat = new StatFs(path.getPath());
      long availBlocks = stat.getAvailableBlocksLong();
      long blockSize = stat.getBlockSizeLong();
      long free_memory = availBlocks * blockSize / 1048576;

      return free_memory;
    }

    public String getMemorySize() {

        String load = null;
        DecimalFormat twoDecimalForm = new DecimalFormat("#.##");
        double totRam = 0;
        String lastValue = "";
        try {
            RandomAccessFile reader = new RandomAccessFile("/proc/meminfo", "r");
            load = reader.readLine();

            // Get the Number value from the string
            Pattern p = Pattern.compile("(\\d+)");
            Matcher m = p.matcher(load);
            String value = "";
            while (m.find()) {
                value = m.group(1);
            }
            reader.close();

            totRam = Double.parseDouble(value);

            double mb = totRam / 1024.0;
            lastValue = twoDecimalForm.format(mb);



        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return lastValue;
    }

    public Number getCpuMhz() {
      Number cpuMaxFreq = null;
        try {
            RandomAccessFile reader = new RandomAccessFile("/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_max_freq", "r");
            cpuMaxFreq = Long.parseLong(reader.readLine());
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return cpuMaxFreq;
    }

}
