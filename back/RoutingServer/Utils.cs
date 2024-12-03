using System.Globalization;
using System.Text;

public static class Utils {
    public static bool CompareStringsIgnoringAccents(string str1, string str2) {
        string normalizedStr1 = str1.Normalize(NormalizationForm.FormD);
        string normalizedStr2 = str2.Normalize(NormalizationForm.FormD);

        // Remove accents
        normalizedStr1 = new string(normalizedStr1
            .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            .ToArray());

        normalizedStr2 = new string(normalizedStr2
            .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            .ToArray());

        return string.Equals(normalizedStr1, normalizedStr2, StringComparison.OrdinalIgnoreCase);
    }
}
